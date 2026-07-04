import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info } from 'lucide-react'

export function AboutSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">Acerca de</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between py-1">
          <span className="text-muted-foreground">Aplicación</span>
          <span className="font-medium">WealthWise</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-muted-foreground">Versión</span>
          <span className="font-mono text-xs">1.0.0</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-muted-foreground">Framework</span>
          <span>React + Vite</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-muted-foreground">Componentes</span>
          <span>shadcn/ui</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-muted-foreground">Almacenamiento</span>
          <span>Local (navegador)</span>
        </div>
      </CardContent>
    </Card>
  )
}
