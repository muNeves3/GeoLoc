using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.use_cases.centros;
using Microsoft.AspNetCore.Mvc;

namespace GeoLoc.src.infra.http.controllers
{
    [Route("api/centro")]
    [ApiController]
    public class centro_controller : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ICentroRequest centro,
            [FromServices] create_centro createCentro)
        {
            if (centro == null)
            {
                return BadRequest("Centro não pode ser nulo.");
            }
            try
            {
                var result = await createCentro.execute(centro);
                return CreatedAtAction(nameof(Post), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao criar centro: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromServices] get_all_centros getAllCentros)
        {
            try
            {
                var centros = await getAllCentros.execute();
                return Ok(centros);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao obter centros: {ex.Message}");
            }
        }
    }
}
