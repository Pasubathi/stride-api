import useSwr from 'swr'
import Link from 'next/link'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Index() {
  const { data, error } = useSwr('/api/users', fetcher)
  
  if (error) return <div>Failed to load users</div>
  if (!data) return <div>Loading...</div>

  return (
      <h1>Welcome</h1>
  )
}
