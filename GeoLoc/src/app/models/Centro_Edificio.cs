using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace GeoLoc.src.app.models
{
    [Table("centro_edificio")]
    public class Centro_Edificio : BaseModel
    {
        [PrimaryKey("id_centro", false)]
        public Guid id_centro { get; set; }
        
        [PrimaryKey("id_edificio", false)]
        public Guid id_edificio { get; set; }

    }
}
