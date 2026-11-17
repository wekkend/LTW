using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ThinkPadManager.Api.Data;
using ThinkPadManager.Api.Dtos;
using ThinkPadManager.Api.Models;

namespace ThinkPadManager.Api.Controllers;

// Route gốc: /api/laptops
[ApiController]
[Route("api/[controller]")]
public class LaptopsController(AppDbContext db) : ControllerBase
{
    // GET /api/laptops?q=carbon&seriesId=x1&years=2024&years=2025&cpus=Core i7&sort=price-asc
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Laptop>>> GetAll(
        string? q, string? seriesId, [FromQuery] int[]? years, [FromQuery] string[]? cpus, string sort = "newest")
    {
        var query = db.Laptops.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(seriesId)) query = query.Where(l => l.SeriesId == seriesId);
        if (!string.IsNullOrWhiteSpace(q)) query = query.Where(l => l.Name.Contains(q));
        if (years is { Length: > 0 }) query = query.Where(l => years.Contains(l.Year));
        if (cpus is { Length: > 0 }) query = query.Where(l => cpus.Contains(l.Cpu));

        query = sort switch
        {
            "price-asc" => query.OrderBy(l => l.Price),
            "price-desc" => query.OrderByDescending(l => l.Price),
            _ => query.OrderByDescending(l => l.Year).ThenBy(l => l.Id),
        };

        return await query.ToListAsync();
    }

    // GET /api/laptops/3
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Laptop>> GetById(int id)
    {
        var laptop = await db.Laptops.AsNoTracking().FirstOrDefaultAsync(l => l.Id == id);
        return laptop is null ? NotFound(new { message = "Không tìm thấy laptop." }) : laptop;
    }

    // POST /api/laptops  (body JSON) -> 201 Created
    [HttpPost]
    public async Task<ActionResult<Laptop>> Create(LaptopInput input)
    {
        if (!await db.Series.AnyAsync(s => s.Id == input.SeriesId))
            return BadRequest(new { message = "Dòng máy không tồn tại." });

        var laptop = new Laptop();
        Apply(laptop, input);
        db.Laptops.Add(laptop);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = laptop.Id }, laptop);
    }

    // PUT /api/laptops/3  (body JSON) -> 200 OK
    [HttpPut("{id:int}")]
    public async Task<ActionResult<Laptop>> Update(int id, LaptopInput input)
    {
        var laptop = await db.Laptops.FindAsync(id);
        if (laptop is null) return NotFound(new { message = "Không tìm thấy laptop." });

        if (!await db.Series.AnyAsync(s => s.Id == input.SeriesId))
            return BadRequest(new { message = "Dòng máy không tồn tại." });

        Apply(laptop, input);
        await db.SaveChangesAsync();
        return laptop;
    }

    // DELETE /api/laptops/3 -> 204 No Content
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var laptop = await db.Laptops.FindAsync(id);
        if (laptop is null) return NotFound(new { message = "Không tìm thấy laptop." });

        db.Laptops.Remove(laptop);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static void Apply(Laptop l, LaptopInput i)
    {
        l.Name = i.Name.Trim();
        l.SeriesId = i.SeriesId;
        l.Year = i.Year;
        l.Cpu = i.Cpu.Trim();
        l.Ram = i.Ram;
        l.Storage = i.Storage.Trim();
        l.Screen = i.Screen.Trim();
        l.Price = i.Price;
        l.Status = i.Status;
        l.Image = i.Image.Trim();
    }
}
