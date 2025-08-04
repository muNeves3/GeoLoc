using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.use_cases.edificios;
using Microsoft.AspNetCore.Mvc;

namespace GeoLoc.src.infra.http.controllers
{
    [Route("api/edificios")]
    [ApiController]
    public class edificios_controller : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] IEdificioRequest edificio,
            [FromServices] create_edificio createEdificio)
        {
            if (edificio == null)
            {
                return BadRequest("Edificio não pode ser nulo.");
            }
            try
            {
                var result = await createEdificio.Execute(edificio);
                return CreatedAtAction(nameof(Post), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao criar edificio: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromServices] get_all_edificios getAllEdificios)
        {
            try
            {
                var edificios = await getAllEdificios.execute();
                return Ok(edificios);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao obter edificios: {ex.Message}");
            }
        }
    }
}
