import { generateBlobImage } from '../lib/services/imageGenerator'
import { writeFileSync } from 'fs'
import path from 'path'

async function main() {
  const testBlob = {
    id: '1',
    content: 'This is a test blob with some longer content to see how it wraps and fits within the image!',
    color: 'purple',
    mood: 'happy',
    created_at: new Date().toISOString(),
    expires_at: new Date().toISOString(),
    user_id: '1',
    like_count: 42
  }

  try {
    const buffer = await generateBlobImage(testBlob, 'test.user@example.com', 42)
    const outputPath = path.join(process.cwd(), 'test-blob.png')
    writeFileSync(outputPath, buffer)
    console.log(`Image generated successfully at: ${outputPath}`)
  } catch (error) {
    console.error('Error generating image:', error)
  }
}

main() 