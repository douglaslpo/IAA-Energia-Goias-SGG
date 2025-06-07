from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app

# Importar rotas
from api.routes import predictions, metrics, analysis

# Criar aplicação FastAPI
app = FastAPI(
    title="API de Análise Energética",
    description="API para análise e previsão de consumo energético",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Adicionar métricas Prometheus
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Incluir rotas
app.include_router(predictions.router, prefix="/api/v1", tags=["predictions"])
app.include_router(metrics.router, prefix="/api/v1", tags=["metrics"])
app.include_router(analysis.router, prefix="/api/v1", tags=["analysis"])

@app.get("/")
async def root():
    return {
        "message": "API de Análise Energética",
        "docs": "/docs",
        "metrics": "/metrics"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 