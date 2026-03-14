'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export type QuestionCategory = 'Persepsi Bahaya' | 'Wawasan' | 'Pengetahuan'

export async function createQuestion(formData: FormData) {
  const supabase = await createClient()

  // Verify admin status
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  const text = formData.get('text') as string
  const category = formData.get('category') as QuestionCategory
  const simType = formData.get('sim_type') as string
  const module = formData.get('module') as string
  const correctAnswer = formData.get('correct_answer') as string
  const mediaFile = formData.get('media') as File | null
  const audioFile = formData.get('audio') as File | null
  const externalUrl = formData.get('external_url') as string | null
  const externalAudioUrl = formData.get('external_audio_url') as string | null

  // Options
  let options: string[] = []
  if (category === 'Persepsi Bahaya') {
    options = ['Mengurangi Kecepatan', 'Melakukan Pengereman', 'Mempertahankan Kecepatan (Stabil)']
  } else {
    options = [
      formData.get('option_1') as string,
      formData.get('option_2') as string,
      formData.get('option_3') as string,
    ].filter(Boolean)
  }

  if (!text || !category || !simType || !correctAnswer || options.length === 0) {
    return { error: 'Missing required fields' }
  }

  let mediaUrl = null
  let mediaType = null
  let audioUrl = null

  // Handle External URL (Priority over file upload for mitigating egress)
  if (externalUrl && externalUrl.trim().length > 0) {
    const url = externalUrl.trim()
    mediaUrl = url
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.endsWith('.mp4') || url.endsWith('.webm')) {
      mediaType = 'video'
    } else {
      mediaType = 'image'
    }
  } else if (mediaFile && mediaFile.size > 0) {
    // Handle media file upload
    const fileExt = mediaFile.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    if (mediaFile.type.startsWith('image/')) mediaType = 'image'
    else if (mediaFile.type.startsWith('video/')) mediaType = 'video'
    else return { error: 'Unsupported media type. Use images or mp4.' }
    const { error: uploadError } = await supabase.storage.from('question-media').upload(fileName, mediaFile)
    if (uploadError) return { error: 'Failed to upload media: ' + uploadError.message }
    const { data: publicUrlData } = supabase.storage.from('question-media').getPublicUrl(fileName)
    mediaUrl = publicUrlData.publicUrl
  }

  // Handle external audio URL
  if (externalAudioUrl && externalAudioUrl.trim().length > 0) {
    audioUrl = externalAudioUrl.trim()
  } else if (audioFile && audioFile.size > 0) {
    // Handle audio file upload
    if (!audioFile.type.startsWith('audio/')) return { error: 'Unsupported audio type. Use mp3, wav, or ogg.' }
    const fileExt = audioFile.name.split('.').pop()
    const fileName = `audio_${uuidv4()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('question-media').upload(fileName, audioFile)
    if (uploadError) return { error: 'Failed to upload audio: ' + uploadError.message }
    const { data: publicUrlData } = supabase.storage.from('question-media').getPublicUrl(fileName)
    audioUrl = publicUrlData.publicUrl
  }

  const { error } = await supabase.from('questions').insert({
    text,
    category,
    sim_type: simType,
    module,
    correct_answer: correctAnswer,
    options,
    media_url: mediaUrl,
    media_type: mediaType,
    audio_url: audioUrl,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/questions')
  return { success: true }
}

export async function updateQuestion(id: string, formData: FormData) {
  const supabase = await createClient()

  // Verify admin status
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  const text = formData.get('text') as string
  const category = formData.get('category') as QuestionCategory
  const simType = formData.get('sim_type') as string
  const module = formData.get('module') as string
  const correctAnswer = formData.get('correct_answer') as string
  const mediaFile = formData.get('media') as File | null
  const audioFile = formData.get('audio') as File | null
  const externalUrl = formData.get('external_url') as string | null
  const externalAudioUrl = formData.get('external_audio_url') as string | null

  // Options
  let options: string[] = []
  if (category === 'Persepsi Bahaya') {
    options = ['Mengurangi Kecepatan', 'Melakukan Pengereman', 'Mempertahankan Kecepatan (Stabil)']
  } else {
    options = [
      formData.get('option_1') as string,
      formData.get('option_2') as string,
      formData.get('option_3') as string,
    ].filter(Boolean)
  }

  if (!text || !category || !simType || !module || !correctAnswer || options.length === 0) {
    return { error: 'Missing required fields' }
  }

  const updateData: any = {
    text,
    category,
    sim_type: simType,
    module,
    correct_answer: correctAnswer,
    options,
  }

  // Handle External URL
  if (externalUrl && externalUrl.trim().length > 0) {
    const url = externalUrl.trim()
    updateData.media_url = url
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.endsWith('.mp4') || url.endsWith('.webm')) {
      updateData.media_type = 'video'
    } else {
      updateData.media_type = 'image'
    }
  } else if (mediaFile && mediaFile.size > 0) {
    // Handle media file upload
    const fileExt = mediaFile.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    let mediaType = null
    if (mediaFile.type.startsWith('image/')) mediaType = 'image'
    else if (mediaFile.type.startsWith('video/')) mediaType = 'video'
    else return { error: 'Unsupported media type. Use images or mp4.' }
    const { error: uploadError } = await supabase.storage.from('question-media').upload(fileName, mediaFile)
    if (uploadError) return { error: 'Failed to upload media: ' + uploadError.message }
    const { data: publicUrlData } = supabase.storage.from('question-media').getPublicUrl(fileName)
    updateData.media_url = publicUrlData.publicUrl
    updateData.media_type = mediaType
  }

  // Handle external audio URL
  if (externalAudioUrl && externalAudioUrl.trim().length > 0) {
    updateData.audio_url = externalAudioUrl.trim()
  } else if (audioFile && audioFile.size > 0) {
    // Handle audio file upload
    if (!audioFile.type.startsWith('audio/')) return { error: 'Unsupported audio type. Use mp3, wav, or ogg.' }
    const fileExt = audioFile.name.split('.').pop()
    const fileName = `audio_${uuidv4()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('question-media').upload(fileName, audioFile)
    if (uploadError) return { error: 'Failed to upload audio: ' + uploadError.message }
    const { data: publicUrlData } = supabase.storage.from('question-media').getPublicUrl(fileName)
    updateData.audio_url = publicUrlData.publicUrl
  }

  const { error } = await supabase
    .from('questions')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/questions')
  return { success: true }
}

export async function deleteQuestion(id: string) {
  const supabase = await createClient()

  // Verify admin status
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  const { data: question } = await supabase.from('questions').select('media_url').eq('id', id).single()

  // Delete media if exists in Supabase Storage
  if (question?.media_url && question.media_url.includes('supabase.co')) {
    // extract filename from url
    const urlParts = question.media_url.split('/')
    const fileName = urlParts[urlParts.length - 1]
    if (fileName) {
      await supabase.storage.from('question-media').remove([fileName])
    }
  }

  const { error } = await supabase.from('questions').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/questions')
  return { success: true }
}
