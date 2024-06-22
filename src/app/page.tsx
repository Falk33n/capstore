import Link from 'next/link';
import { CreateUser } from '@/components/create-post';

export default async function Home() {
  return (
    <main className='flex flex-col justify-center items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] min-h-screen text-white'>
      <div className='flex flex-col justify-center items-center gap-12 px-4 py-16 container'>
        <h1 className='font-extrabold text-5xl sm:text-[5rem] tracking-tight'>
          Create <span className='text-[hsl(280,100%,70%)]'>T3</span> App
        </h1>
        <div className='gap-4 md:gap-8 grid grid-cols-1 sm:grid-cols-2'>
          <Link
            className='flex flex-col gap-4 bg-white/10 hover:bg-white/20 p-4 rounded-xl max-w-xs'
            href='https://create.t3.gg/en/usage/first-steps'
            target='_blank'
          >
            <h3 className='font-bold text-2xl'>First Steps →</h3>
            <div className='text-lg'>
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className='flex flex-col gap-4 bg-white/10 hover:bg-white/20 p-4 rounded-xl max-w-xs'
            href='https://create.t3.gg/en/introduction'
            target='_blank'
          >
            <h3 className='font-bold text-2xl'>Documentation →</h3>
            <div className='text-lg'>
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>
        <div className='flex flex-col items-center gap-2'>
          <p className='text-2xl text-white'>hello</p>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  return (
    <div className='w-full max-w-xs'>
      <CreateUser />
    </div>
  );
}
