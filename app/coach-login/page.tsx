import { redirect } from 'next/navigation'
export default function CoachLoginAliasPage() { redirect('/auth/login?role=coach') }
