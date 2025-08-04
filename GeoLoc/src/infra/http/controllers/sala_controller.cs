using Microsoft.AspNetCore.Mvc;

namespace GeoLoc.src.infra.http.controllers
{
    [Route("api/sala")]
    public class sala_controller : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> CreateSala(
            [FromBody] GeoLoc.src.app.DTOs.ISalaRequest salaRequest,
            [FromServices] GeoLoc.src.app.use_cases.salas.create_sala createSala)
        {
            if (salaRequest == null)
            {
                return BadRequest("Sala request cannot be null.");
            }
            try
            {
                var response = await createSala.execute(salaRequest);
                return CreatedAtAction(nameof(CreateSala), response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating sala: {ex.Message}");
            }
        }
    }
}
