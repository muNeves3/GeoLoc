using GeoLoc.src.app.use_cases.centros_edificios;
using Microsoft.AspNetCore.Mvc;

namespace GeoLoc.src.infra.http.controllers
{
    [Route("api/centro_edificio")]
    [ApiController]
    public class centro_edificio_controller : ControllerBase
    {
        [HttpDelete("{id_centro}/{id_edificio}")]
        public async Task<IActionResult> DesassociarCentroEdificio(string id_centro, string id_edificio,
            [FromServices] GeoLoc.src.app.use_cases.centros_edificios.desassociar_centro_edificio desassociarCentroEdificio)
        {
            if (id_centro == null || id_edificio == null)
            {
                return BadRequest("IDs devem ser maiores que zero.");
            }
            try
            {
                await desassociarCentroEdificio.Execute(id_centro, id_edificio);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao desassociar centro e edifício: {ex.Message}");
            }
        }

        [HttpPost("{id_centro}/{id_edificio}")]
        public async Task<IActionResult> AssociarCentroEdificio(string id_centro, string id_edificio,
            [FromServices] associar_centro_edificio associarCentroEdificio)
        {
            if (id_centro == null || id_edificio == null)
            {
                return BadRequest("IDs devem ser maiores que zero.");
            }
            try
            {
                await associarCentroEdificio.Execute(id_centro, id_edificio);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao associar centro e edifício: {ex.Message}");
            }
        }

        [HttpGet("{id_edificio}")]
        public async Task<IActionResult> GetCentrosEdificios(
            string id_edificio,
            [FromServices] listar_centro_edificio getCentrosEdificios)
        {
            try
            {
                var centrosEdificios = await getCentrosEdificios.Execute(id_edificio);
                return Ok(centrosEdificios);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao obter centros e edifícios: {ex.Message}");
            }
        }


    }
}
