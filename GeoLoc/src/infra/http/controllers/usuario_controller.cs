using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GeoLoc.src.infra.http.controllers
{
    [Route("api/usuario")]
    [ApiController]
    public class usuario_controller : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] GeoLoc.src.app.DTOs.IUsuarioRequest perfilUsuario,
            [FromServices] GeoLoc.src.app.use_cases.create_perfil_usuario createPerfilUsuario)
        {
            if (perfilUsuario == null)
            {
                return BadRequest("Perfil de usuário não pode ser nulo.");
            }
            try
            {
                var result = await createPerfilUsuario.execute(perfilUsuario);
                return CreatedAtAction(nameof(Post), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao criar perfil de usuário: {ex.Message}");
            }
        }
    }
}
