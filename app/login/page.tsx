'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
})

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true)
    
    // In a real application, this would call an API for verification
    setTimeout(() => {
      if (
        values.email === 'jiaoliang.chen@artefact.com' &&
        values.password === 'cjl@2025'
      ) {
        // Set login status
        localStorage.setItem('isLoggedIn', 'true')
        // Store user information
        localStorage.setItem('user', JSON.stringify({
          email: values.email,
          name: 'Jiaoliang Chen'
        }))
        
        toast.success('Login successful')
        router.push('/dashboard')
      } else {
        toast.error('Incorrect email or password')
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 p-4">
      {/* Ubisoft Logo */}
      <div className="mb-2">
        <Image 
          src="/logos/ubisoft-logo.png" 
          alt="Ubisoft" 
          width={160} 
          height={54} 
          priority
        />
      </div>
      
      {/* Lighthouse Studio 标题和标语 */}
      <div className="mb-6 text-center group">
        <div className="relative overflow-hidden">
          <span className="text-2xl font-medium bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
            Lighthouse Studio
          </span>
          <span className="text-base text-muted-foreground ml-2 animate-fade-in">
            See what matters in the noise.
          </span>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-600/30 transform translate-y-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
        </div>
      </div>
      
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" size="sm" className="px-0">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            ©2024 Lighthouse Social Listening Platform
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 