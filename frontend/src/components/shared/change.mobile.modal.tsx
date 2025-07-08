
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChangeMobileModal({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Input type="number" placeholder="Old Mobile Number" className="bg-purple-800 text-white" />
      <Input type="number" placeholder="New Mobile Number" className="bg-purple-800 text-white" />
      <Input type="number" placeholder="Confirm MobileNumber" className="bg-purple-800 text-white" />
      <div className="flex justify-between mt-2">
        <Button onClick={onBack} variant="secondary" className="text-purple-200 bg-purple-700 hover:bg-purple-600">Back</Button>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">Update</Button>
      </div>
    </div>
  )
}
