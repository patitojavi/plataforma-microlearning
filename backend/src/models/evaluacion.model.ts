import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface EvaluacionPregunta {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
}

export interface IEvaluacion extends mongoose.Document {
  capacitacion: mongoose.Types.ObjectId;
  preguntas: EvaluacionPregunta[];
}

const EvaluacionSchema = new Schema<IEvaluacion>({
  capacitacion: { type: Schema.Types.ObjectId, ref: 'Capacitacion', required: true },
  preguntas: [
    {
      pregunta: { type: String, required: true },
      opciones: [{ type: String }],
      respuestaCorrecta: { type: String, required: true }
    }
  ]
});

export const Evaluacion = mongoose.model<IEvaluacion>('Evaluacion', EvaluacionSchema);
