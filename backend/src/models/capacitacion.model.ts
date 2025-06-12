import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface ICapacitacion extends mongoose.Document {
  titulo: string;
  descripcion: string;
  creador: mongoose.Types.ObjectId;
  miembros: mongoose.Types.ObjectId[];
  contenido: string[]; // Ej: lista de videos o módulos
  progreso: Record<string, number>; // userId: % progreso
}

const CapacitacionSchema = new Schema<ICapacitacion>({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  creador: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  miembros: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  contenido: [{ type: String }], // por ahora solo textos/vídeos
  progreso: { type: Map, of: Number, default: {} }
}, { timestamps: true });

export const Capacitacion = mongoose.model<ICapacitacion>('Capacitacion', CapacitacionSchema);
