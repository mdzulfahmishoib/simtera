'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function submitQuizResult(data: {
  participant_name: string
  participant_email: string
  sim_type: string
  module: string
  answers: Record<string, string>
}) {
  const supabase = await createClient()

  // 1. Fetch the correct answers from the database for the provided questions
  const questionIds = Object.keys(data.answers)
  if (questionIds.length === 0) {
    return { error: 'Gagal memproses jawaban. Tidak ada jawaban yang dikirim.' }
  }

  const { data: questions, error: fetchError } = await supabase
    .from('questions')
    .select('id, category, correct_answer')
    .in('id', questionIds)

  if (fetchError || !questions) {
    console.error('Error fetching questions for scoring:', fetchError)
    return { error: 'Gagal memproses hasil ujian.' }
  }

  // 2. Calculate scores on the server
  let scoreP = 0
  let scoreW = 0
  let scoreK = 0

  questions.forEach((q) => {
    const userAnswer = data.answers[q.id]
    if (userAnswer === q.correct_answer) {
      if (q.category === 'Persepsi Bahaya') scoreP += 1
      if (q.category === 'Wawasan') scoreW += 1
      if (q.category === 'Pengetahuan') scoreK += 1
    }
  })

  const totalCorrect = scoreP + scoreW + scoreK
  // Scoring: (correct / total questions) * 100
  // total expected questions = 25 (P) + 20 (W) + 20 (K) = 65
  const totalScore = Math.round((totalCorrect / 65) * 100)
  const passStatus = totalScore >= 70

  const { data: record, error } = await supabase
    .from('test_results')
    .insert({
      participant_name: data.participant_name,
      participant_email: data.participant_email,
      sim_type: data.sim_type,
      module: data.module,
      score_persepsi: scoreP,
      score_wawasan: scoreW,
      score_pengetahuan: scoreK,
      total_score: totalScore,
      pass_status: passStatus
    })
    .select()
    .single()

  if (error) {
    console.error('Error submitting quiz result:', error)
    return { error: 'Gagal menyimpan hasil ujian.' }
  }

  return { id: record.id }
}
