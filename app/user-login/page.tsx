import { redirect } from 'next/navigation'
export default function UserLoginAliasPage() { redirect('/auth/login?role=user') }
