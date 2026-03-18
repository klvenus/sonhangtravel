// Cloudinary upload helper
function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_KEY;
  const apiSecret = process.env.CLOUDINARY_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Missing Cloudinary environment variables');
  }

  return { cloudName, apiKey, apiSecret };
}

async function sha1(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-1', encoder.encode(data));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string | null> {
  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=sonhangtravel&timestamp=${timestamp}`;
    const signature = await sha1(paramsToSign + apiSecret);

    const formData = new FormData();
    formData.append('file', new Blob([buffer]), filename);
    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);
    formData.append('folder', 'sonhangtravel');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      console.error('Cloudinary error:', await res.text());
      return null;
    }

    const result = await res.json();
    return result.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}
