const SPECULATION_RULES = {
  prefetch: [
    {
      source: 'document',
      where: {
        and: [
          { href_matches: '/tour/*' },
          { not: { selector_matches: '[target], [download], [rel~=external], [href*="/api/"]' } },
        ],
      },
      eagerness: 'moderate',
    },
    {
      source: 'document',
      where: {
        and: [
          { href_matches: '/tours*' },
          { not: { selector_matches: '[target], [download], [rel~=external], [href*="/api/"]' } },
        ],
      },
      eagerness: 'moderate',
    },
    {
      source: 'document',
      where: {
        and: [
          { href_matches: '/blog*' },
          { not: { selector_matches: '[target], [download], [rel~=external], [href*="/api/"]' } },
        ],
      },
      eagerness: 'conservative',
    },
  ],
}

export default function SpeculationRules() {
  return (
    <script
      type="speculationrules"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(SPECULATION_RULES) }}
    />
  )
}
