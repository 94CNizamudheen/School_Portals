

import { Button } from '../../components/ui/button';
import type { Child } from '../../store/parentSlice';
interface Props {
    name: string;
    childrenList:Child[];
    onClose: () => void;
}

export function ViewChildrenModal({ name, childrenList, onClose }: Props) {
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-gray-600 dark:bg-gray-800 rounded-lg p-6 w-[40%] max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-white">Children of {name}</h2>
                {childrenList?.length > 0 ? (
                    <ul className="list-disc pl-5 text-white">
                        {childrenList.map((child) => (
                            <li key={child._id}>
                                {child.firstName} {child.lastName}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-400">No children assigned.</p>
                )}
                <div className="mt-4 text-right">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}
