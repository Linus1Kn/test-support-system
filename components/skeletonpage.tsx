
export default function SkeletonPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <div className="w-5 h-5 animate-spin">
        <div className="w-1/2 h-full overflow-clip">
          <div className="w-5 h-5 rounded-full border-3 border-gray-500"></div>
        </div>
      </div>
    </div>
  )
}
