import { useSession } from "next-auth/react"

export default function HomeHeader() {
    const {data: session} = useSession()
    return (
        <div className="text-blue-900 flex justify-between">
            <h2 className="mt-0">
                Hello, <b>{session?.user?.name}</b>
            </h2>
            <div>
                <div className="bg-gray-300 h-8 flex items-center bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
                <img src={session?.user?.image} alt="" className="w-8 h-8"/>
                <span className="px-2 pb-1">
                    {session?.user?.name}
                </span>
                </div>      
            </div>
        </div>
    )
}