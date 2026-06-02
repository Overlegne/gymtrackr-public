
"use client"

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { addExercise, type MuscleGroup, type Equipment } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

interface AddExerciseDialogProps {
  onExerciseAdded: () => void;
}

export function AddExerciseDialog({ onExerciseAdded }: AddExerciseDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('Chest');
  const [equipment, setEquipment] = useState<Equipment>('Barbell');
  const [cues, setCues] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addExercise({
      name,
      muscleGroup,
      equipment,
      defaultSets: 3,
      defaultReps: 12,
      cues: cues.split('\n').filter(c => c.trim() !== '')
    });

    toast({
      title: "Exercise added",
      description: `"${name}" has been successfully created with custom coaching details.`
    });

    setOpen(false);
    setName('');
    setCues('');
    onExerciseAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="rounded-full h-10 w-10">
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">New Exercise</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Exercise Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Incline Dumbbell Press" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-12"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Muscle Group</Label>
              <Select value={muscleGroup} onValueChange={(v) => setMuscleGroup(v as MuscleGroup)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Choose..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chest">Chest</SelectItem>
                  <SelectItem value="Back">Back</SelectItem>
                  <SelectItem value="Legs">Legs</SelectItem>
                  <SelectItem value="Shoulders">Shoulders</SelectItem>
                  <SelectItem value="Arms">Arms</SelectItem>
                  <SelectItem value="Abs">Abs</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Equipment</Label>
              <Select value={equipment} onValueChange={(v) => setEquipment(v as Equipment)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Choose..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dumbbell">Dumbbell</SelectItem>
                  <SelectItem value="Barbell">Barbell</SelectItem>
                  <SelectItem value="Machine">Machine</SelectItem>
                  <SelectItem value="Cable">Cable</SelectItem>
                  <SelectItem value="Bodyweight">Bodyweight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Form Cues (Optional, one per line)</Label>
            <Textarea 
              placeholder="Drive through heels..."
              value={cues}
              onChange={(e) => setCues(e.target.value)}
              className="rounded-xl min-h-[100px]"
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full rounded-xl h-12 font-black uppercase tracking-widest">Add Exercise</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
