import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Edit3 } from "lucide-react";



const InfoCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    data: Array<{ label: string; value?: string | null; icon?: React.ReactNode }>;
    onEdit?: () => void;
  }> = ({ title, icon, data, onEdit }) => (
    <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              {icon}
            </div>
            <span className="text-gray-800 font-bold">{title}</span>
          </div>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-100 rounded-2xl">
            {item.icon && (
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {item.icon}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium">{item.label}</p>
              <p className="text-gray-800 font-semibold">{item.value || 'Not specified'}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
export default InfoCard