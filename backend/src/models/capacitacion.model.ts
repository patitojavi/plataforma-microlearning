import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface ICapacitacion extends mongoose.Document {
  titulo: string;
  descripcion: string;
  creador: mongoose.Types.ObjectId;
  miembros: mongoose.Types.ObjectId[];
  contenido: string[]; 
  progreso: Map<string, number>; 
  videoUrl?: string;
  comentarios: string[];
}

const CapacitacionSchema = new Schema<ICapacitacion>({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  creador: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  miembros: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  contenido: [{ type: String }],
  progreso: { type: Map, of: Number, default: {} },
  videoUrl: { type: String },
  comentarios: [{ type: String }]
}, { timestamps: true });

export const Capacitacion = mongoose.model<ICapacitacion>('Capacitacion', CapacitacionSchema);
