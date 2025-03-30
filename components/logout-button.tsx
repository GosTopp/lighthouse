'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear login status
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
    router.push('/login')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  )
}

// 导出默认组件，以支持动态导入
export default LogoutButton 