using GeoLoc.src.app.repositories;
using Microsoft.AspNetCore.Mvc;

namespace GeoLoc.src.infra.http.controllers
{
    [Route("api/rotas")]
    [ApiController]
    public class rotas_controller : ControllerBase
    {
        private readonly INavegacaoService _navegacaoService;

        public rotas_controller(INavegacaoService navegacaoService)
        {
            _navegacaoService = navegacaoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRota(
        [FromQuery] double origemLat,
        [FromQuery] double origemLon,
        [FromQuery] Guid destinoId)
        {
            try
            {
                var rota = await _navegacaoService.CalcularRota(origemLat, origemLon, destinoId);
                if (rota == null || !rota.Any())
                {
                    return NotFound("Não foi possível calcular a rota.");
                }
                return Ok(rota);
            }
            catch (Exception ex)
            {
                // Logar a exceção
                return StatusCode(500, "Ocorreu um erro interno ao calcular a rota.");
            }
        }
    }
}
