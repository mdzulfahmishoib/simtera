"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteResults(ids: string[]) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('test_results')
      .delete()
      .in('id', ids)

    if (error) throw error

    revalidatePath('/admin/results')
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting results:", error)
    return { error: error.message || "Failed to delete results" }
  }
}
