
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
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('Borst');
  const [equipment, setEquipment] = useState<Equipment>('Barbell');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    // Use a relevant placeholder based on muscle group
    const seedMap: Record<string, string> = {
      'Borst': 'bench',
      'Benen': 'squat',
      'Rug': 'deadlift',
      'Schouders': 'shoulder',
      'Armen': 'bicep',
      'Buik': 'abs',
      'Cardio': 'cardio'
    };

    addExercise({
      name,
      muscleGroup,
      equipment,
      defaultSets: 3,
      defaultReps: 12,
      imageUrl: `https://picsum.photos/seed/${seedMap[muscleGroup] || 'gym'}/600/400`
    });

    toast({
      title: "Oefening toegevoegd",
      description: `"${name}" is succesvol aangemaakt.`
    });

    setOpen(false);
    setName('');
    onExerciseAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="rounded-full h-10 w-10">
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nieuwe Oefening</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Naam</Label>
            <Input 
              id="name" 
              placeholder="bijv. Incline Dumbbell Press" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Spiergroep</Label>
              <Select value={muscleGroup} onValueChange={(v) => setMuscleGroup(v as MuscleGroup)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kies..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Borst">Borst</SelectItem>
                  <SelectItem value="Rug">Rug</SelectItem>
                  <SelectItem value="Benen">Benen</SelectItem>
                  <SelectItem value="Schouders">Schouders</SelectItem>
                  <SelectItem value="Armen">Armen</SelectItem>
                  <SelectItem value="Buik">Buik</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Materiaal</Label>
              <Select value={equipment} onValueChange={(v) => setEquipment(v as Equipment)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kies..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Halter">Halter</SelectItem>
                  <SelectItem value="Barbell">Barbell</SelectItem>
                  <SelectItem value="Machine">Machine</SelectItem>
                  <SelectItem value="Kabel">Kabel</SelectItem>
                  <SelectItem value="Bodyweight">Bodyweight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full">Toevoegen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
