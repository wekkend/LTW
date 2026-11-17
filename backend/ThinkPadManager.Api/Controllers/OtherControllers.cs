using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ThinkPadManager.Api.Data;
using ThinkPadManager.Api.Dtos;
using ThinkPadManager.Api.Models;

namespace ThinkPadManager.Api.Controllers;

// GET /api/series
[ApiController]
[Route("api/[controller]")]
public class SeriesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Series>>> GetAll() =>
        await db.Series.AsNoTracking().OrderBy(s => s.Name).Select(s => new Series
        {
            Id = s.Id, Name = s.Name, Code = s.Code, Desc = s.Desc,
        }).ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Series>> GetById(string id)
    {
        var s = await db.Series.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return s is null ? NotFound(new { message = "Không tìm thấy dòng máy." }) : new Series
        {
            Id = s.Id, Name = s.Name, Code = s.Code, Desc = s.Desc,
        };
    }
}

// GET /api/stats
[ApiController]
[Route("api/[controller]")]
public class StatsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<StatsDto> Get() => new(
        await db.Laptops.CountAsync(),
        await db.Laptops.CountAsync(l => l.Status == LaptopStatus.Available),
        await db.Laptops.CountAsync(l => l.Status == LaptopStatus.Borrowed),
        await db.Laptops.CountAsync(l => l.Status == LaptopStatus.Repairing));
}

// POST /api/contact
[ApiController]
[Route("api/[controller]")]
public class ContactController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Send(ContactInput input)
    {
        db.ContactMessages.Add(new ContactMessage
        {
            Name = input.Name.Trim(), Email = input.Email.Trim(), Message = input.Message.Trim(),
        });
        await db.SaveChangesAsync();
        return StatusCode(StatusCodes.Status201Created, new { message = "Đã nhận thông tin của bạn." });
    }
}
