#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import process from 'node:process'

const PAGE_URL = 'https://www.facebook.com/sonhangtravel'
const BLOG_URL = 'https://sonhangtravel.com/blog'
const STATE_PATH = '/Users/khumlong/.openclaw/workspaces/sonhang-travel/memory/fb-latest-post-state.json'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

function normalizeText(text = '') {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[“”‘’]/g, '"')
    .trim()
    .toLowerCase()
}

function textHash(text = '') {
  return crypto.createHash('sha1').update(normalizeText(text)).digest('hex')
}

function ensureStateDir() {
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true })
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'))
  } catch {
    return {}
  }
}

function saveState(patch) {
  ensureStateDir()
  const next = { ...loadState(), ...patch, updatedAt: new Date().toISOString() }
  fs.writeFileSync(STATE_PATH, JSON.stringify(next, null, 2))
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'user-agent': UA,
      'accept-language': 'vi-VN,vi;q=0.9,en;q=0.8',
    },
  })
  return { status: res.status, text: await res.text() }
}

function extractLatestPostCandidate(html) {
  const postUrlMatch = html.match(/https:\/\/www\.facebook\.com\/sonhangtravel\/posts\/pfbid[^"'\\\s<]+/)
  const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i)
  const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/i)
  const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i)

  const text = [titleMatch?.[1], descMatch?.[1]].filter(Boolean).join(' ').trim()

  if (!postUrlMatch && !text) return null

  return {
    postUrl: postUrlMatch?.[0] || null,
    text,
    image: imageMatch?.[1] || null,
  }
}

function extractLatestBlogSummary(html) {
  const links = [...html.matchAll(/href="\/blog\/([^"]+)"/g)].map((m) => m[1])
  const firstSlug = links[0] || null
  return { latestSlug: firstSlug }
}

async function main() {
  const page = await fetchText(PAGE_URL)

  if (page.status >= 400) {
    saveState({ lastError: `facebook page http ${page.status}` })
    console.log(JSON.stringify({ status: 'blocked', reason: `facebook page http ${page.status}` }))
    return
  }

  const lowered = page.text.toLowerCase()
  if (lowered.includes('đăng nhập') || lowered.includes('trình duyệt này không hỗ trợ facebook') || lowered.includes('login')) {
    saveState({ lastError: 'facebook login-gated or blocked' })
    console.log(JSON.stringify({ status: 'blocked', reason: 'facebook login-gated or blocked' }))
    return
  }

  const candidate = extractLatestPostCandidate(page.text)
  if (!candidate || !candidate.postUrl || !candidate.text) {
    saveState({ lastError: 'ambiguous latest post detection' })
    console.log(JSON.stringify({ status: 'ambiguous', reason: 'ambiguous latest post detection' }))
    return
  }

  const hash = textHash(candidate.text)
  const state = loadState()

  if (state.lastProcessedPostUrl === candidate.postUrl || state.lastProcessedPostTextHash === hash) {
    console.log(JSON.stringify({ status: 'none', reason: 'same as last processed state', postUrl: candidate.postUrl }))
    return
  }

  const blog = await fetchText(BLOG_URL)
  const blogSummary = blog.status < 400 ? extractLatestBlogSummary(blog.text) : { latestSlug: null }

  console.log(JSON.stringify({
    status: 'new',
    postUrl: candidate.postUrl,
    text: candidate.text,
    textHash: hash,
    image: candidate.image,
    latestBlogSlug: blogSummary.latestSlug,
  }))
}

main().catch((error) => {
  saveState({ lastError: String(error) })
  console.log(JSON.stringify({ status: 'blocked', reason: String(error) }))
  process.exit(0)
})
