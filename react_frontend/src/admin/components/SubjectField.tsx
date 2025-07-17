import { useState } from "react";
import { useController } from "react-hook-form";
import type { Control } from "react-hook-form";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "../../components/ui/command";
import { FormMessage } from "../../components/ui/form";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Check } from "lucide-react";
import clsx from "clsx";
import * as Yup from "yup";
import type { teacherSchema } from "../../utils/validationSchemas";

type TeacherFormValues = Yup.InferType<typeof teacherSchema>;

const allSubjects = ["Math", "Physics", "Chemistry", "Biology", "English"];

type SubjectFieldProps = {
    control: Control<TeacherFormValues>; 
};

export const SubjectField = ({ control }: SubjectFieldProps) => {
    const {
        field,
        fieldState: { error },
    } = useController({
        name: "subjects",
        control,
    });

    const selectedSubjects: string[] = field.value || [];
    const [open, setOpen] = useState(false);

    const toggleSubject = (subject: string) => {
        const updated = selectedSubjects.includes(subject)
            ? selectedSubjects.filter((s) => s !== subject)
            : [...selectedSubjects, subject];

        field.onChange(updated);
        setOpen(false);
    };

    const removeSubject = (subjectToRemove: string) => {
        field.onChange(selectedSubjects.filter((s) => s !== subjectToRemove));
    };

    return (
        <div className="space-y-2">
            <Label>
                Subjects <span className="text-red-500">*</span>
            </Label>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className={clsx("w-full justify-start", error && "border-red-500")}
                    >
                        {selectedSubjects.length > 0
                            ? selectedSubjects.join(", ")
                            : <span className="text-muted-foreground">Click here to select subject...</span>}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandList>
                            <CommandGroup heading="Subjects">
                                <ScrollArea className="h-48">
                                    {allSubjects.map((subject) => (
                                        <CommandItem
                                            key={subject}
                                            onSelect={() => toggleSubject(subject)}
                                            className="cursor-pointer"
                                        >
                                            <Check
                                                className={clsx(
                                                    "mr-2 h-4 w-4",
                                                    selectedSubjects.includes(subject) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {subject}
                                        </CommandItem>
                                    ))}
                                </ScrollArea>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <Button type="button" onClick={() => setOpen(true)} variant="secondary">
                Add Subject
            </Button>

            <div className="flex flex-wrap gap-2">
                {selectedSubjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                        {subject}
                        <button
                            type="button"
                            onClick={() => removeSubject(subject)}
                            className="ml-1 text-red-500"
                        >
                            ×
                        </button>
                    </Badge>
                ))}
            </div>

            {error && <FormMessage>{error.message}</FormMessage>}
        </div>
    );
};
