

# OllyChat: Agentes de IA para DevOps

![ OllyChat](https://raw.githubusercontent.com/alexkroman/ollychat/refs/heads/main/public/olly-small-rectangle.jpeg)

OllyChat te permite crear agentes de IA personalizados para DevOps que comprenden y administran tu infraestructura.

## Los ingenieros se están ahogando en problemas de confiabilidad

Según un informe reciente de New Relic:

- Las empresas experimentan 97 minutos de tiempo de inactividad cada semana: cada minuto reduce tus ganancias en $15,000
- ~400 minutos de interrupciones por mes: mantienen a los ingenieros en un modo reactivo de "apagar fuegos" en lugar de innovar
- El 90% del tiempo de respuesta a incidentes se desperdicia en "ClickOps"
- buscando en paneles en lugar de resolver problemas.

El futuro de la observabilidad no son más paneles y alertas. Son agentes de IA diseñados a medida que funcionan como un ingeniero SRE (site reliability engineer) experto, sin causar agotamiento.

## Conoce OllyChat

OllyChat no es otra herramienta, es un compañero de equipo de IA que trabaja de la misma manera que tu equipo:

- Integrado en tu flujo de trabajo: Slack, Teams, JIRA; dondequiera que se comuniquen tus equipos
- Comprende tu infraestructura: integrado de manera fluida con tu cadena de herramientas SRE
- Automatización impulsada por IA: resuelve incidentes más rápido de lo que cualquier humano podría

## La plataforma DevOps de código abierto AI-First

Las herramientas de observabilidad y gestión de incidentes de hoy no fueron diseñadas para la IA. Fueron creadas para humanos, limitadas por paneles, tiempos de respuesta de guardia y procesos manuales.

OllyChat cambia las reglas del juego. Es una plataforma AI-first (centrada en IA) que:

- Diagnostica incidentes en tiempo real
- Automatiza la remediación con agentes impulsados por IA que tú controlas
- Aprende de tu infraestructura y flujos de trabajo únicos con el tiempo

## Comienza con nuestro servidor Prometheus de demostración

Puedes probar OllyChat sin ningún dato de observabilidad apuntando tu configuración a nuestro servidor Prometheus de demostración: <http://34.123.158.139:9090>

## ✨ Características

- [Chatea con tus datos de observabilidad](DEMO.md)
- [Crea tu propio Agente de IA para DevOps](#building-your-own-devops-ai-agent-with-ollychat)

## 🖥️ OllyChat en la CLI

![CLI Demo](https://raw.githubusercontent.com/alexkroman/ollychat/refs/heads/main/public/cli-demo-2.gif)

## 💬 OllyChat en Slack

![Slack Demo](https://github.com/alexkroman/ollychat/blob/main/public/slack-demo.gif?raw=true)

## 📊 Plataformas de Observabilidad Soportadas

- Prometheus
- New Relic (próximamente)
- DataDog (próximamente)
- Elastic (próximamente)

## 🧠 LLMs Soportados

- OpenAI
- Anthropic
- [Ollama (soporte para herramientas)](https://ollama.com/search?c=tools)

## 🚀 Comenzar sin Docker

### Prerrequisitos

- node.js
- npm

### Instalación

```bash
# Clone the repository
git clone https://github.com/alexkroman/ollychat.git

cd ollychat

# Install dependencies
npm install
```

### Configura tus Variables de Entorno

```bash
cp env-example.sh .env
Edit `.env` with your settings
```

### Ejecutar la CLI

```bash
# Start the CLI
npm run cli:start
```

### Instalando la Integración Opcional de Slack

1. Crea una aplicación de Slack:

   - Visita [Slack API](https://api.slack.com/apps)
   - Haz clic en "Create New App" → "From an app manifest"
   - Selecciona tu espacio de trabajo
   - Copia el JSON en `deploy/slack/slack-manifest.json`

2. Instala la aplicación en tu espacio de trabajo:

   - Navega a "Install App" en la configuración de tu aplicación de Slack
   - Haz clic en "Install to Workspace"
   - Otorga los permisos solicitados

3. Inicia el bot de Slack:

```bash
# Start the Slack backend
npm run slack:start
```

### Uso de OllyChat en Slack

Invita a @olly a tu canal de equipo o de incidentes.

- @olly ¿cuál es el estado de salud de mi clúster?
- @olly ¿hay alguna alerta?
- @olly ¿qué pods están consumiendo más memoria?

## Comenzar con Docker

Puedes usar Docker para desplegar tanto la aplicación de Slack como la aplicación CLI

### Configura tus Variables de Entorno de Docker

```bash
cp env-example.sh .env
# Edit .env with your settings
```

### Construir el Contenedor

```bash
# Build the docker container
npm run docker:build
```

### Ejecutar la CLI

```bash
# Build the docker container
npm run docker:run:cli
```

### Ejecutar la Aplicación de Slack

```bash
# Build the docker container
npm run docker:run:slack
```

## ❤️ Contribuir

- Envía una [solicitud de función](https://github.com/alexkroman/ollychat/issues/new) o un [reporte de error](https://github.com/alexkroman/ollychat/issues/new)

### Creando tu propio Agente de IA para DevOps con OllyChat

- Puedes usar src/tools/prometheus.ts como una plantilla para comenzar

```bash
# Use prometheus agent as a template
cp src/tools/prometheus.ts src/tools/newTool.ts
```

- Agrega tu herramienta como una importación y al array de herramientas en src/tools/index.ts

### Ejecutar Pruebas

```bash
npm test
```

### Ejecutar Linter

```bash
npm run lint
```

### Generar Ejecución de Evaluación

Cuando realices cambios en la aplicación, debes generar una ejecución de evaluación para probar tu cambio contra los ground truths (datos de referencia).

```bash
# Load the latest version of the evaluation data
npm run evals:load

# Run the evaluations
npm run evals:start
```

## 📜 Licencia

Ollychat tiene licencia MIT. Consulta [LICENSE](LICENSE.txt) para más detalles.
