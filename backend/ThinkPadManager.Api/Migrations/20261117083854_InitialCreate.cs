using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ThinkPadManager.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Series",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Desc = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Series", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Laptops",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    SeriesId = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Cpu = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Ram = table.Column<int>(type: "int", nullable: false),
                    Storage = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Screen = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Price = table.Column<long>(type: "bigint", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Laptops", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Laptops_Series_SeriesId",
                        column: x => x.SeriesId,
                        principalTable: "Series",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Series",
                columns: new[] { "Id", "Code", "Desc", "Name" },
                values: new object[,]
                {
                    { "e-l", "E / L", "Văn phòng phổ thông, giá tốt, đủ dùng hằng ngày.", "ThinkPad E - L Series" },
                    { "p", "P", "Máy trạm mạnh cho đồ họa, dựng phim, kỹ thuật.", "Workstation P Series" },
                    { "t", "T", "Bền bỉ, cân bằng hiệu năng, quen thuộc với doanh nghiệp.", "ThinkPad T Series" },
                    { "thinkbook", "ThinkBook", "Dành cho doanh nghiệp vừa và nhỏ, giá dễ tiếp cận.", "ThinkBook" },
                    { "x", "X", "Nhỏ gọn, nhẹ, phù hợp người hay di chuyển.", "ThinkPad X Series" },
                    { "x1", "X1", "Cao cấp, siêu mỏng nhẹ, dòng đầu bảng của ThinkPad.", "ThinkPad X1 Series" },
                    { "z", "Z", "Thiết kế sang trọng, vật liệu cao cấp.", "ThinkPad Z Series" }
                });

            migrationBuilder.InsertData(
                table: "Laptops",
                columns: new[] { "Id", "Cpu", "Image", "Name", "Price", "Ram", "Screen", "SeriesId", "Status", "Storage", "Year" },
                values: new object[,]
                {
                    { 1, "Core Ultra 7", "x1-carbon.jpg", "ThinkPad X1 Carbon Gen 12", 52900000L, 32, "14\" 2.8K OLED", "x1", "Available", "1TB SSD", 2024 },
                    { 2, "Core i7", "x1-yoga.jpg", "ThinkPad X1 Yoga Gen 8", 44900000L, 16, "14\" WUXGA cảm ứng", "x1", "Borrowed", "512GB SSD", 2023 },
                    { 3, "Core Ultra 5", "t14.jpg", "ThinkPad T14 Gen 5", 29900000L, 16, "14\" WUXGA", "t", "Available", "512GB SSD", 2024 },
                    { 4, "Core i7", "t16.jpg", "ThinkPad T16 Gen 2", 32500000L, 16, "16\" WUXGA", "t", "Repairing", "512GB SSD", 2023 },
                    { 5, "Core Ultra 5", "e14.jpg", "ThinkPad E14 Gen 6", 19900000L, 16, "14\" WUXGA", "e-l", "Available", "512GB SSD", 2025 },
                    { 6, "Core i5", "l14.jpg", "ThinkPad L14 Gen 5", 17500000L, 8, "14\" FHD", "e-l", "Available", "256GB SSD", 2024 },
                    { 7, "Core Ultra 9", "p1.jpg", "ThinkPad P1 Gen 7", 89900000L, 64, "16\" 3.2K OLED", "p", "Borrowed", "2TB SSD", 2025 },
                    { 8, "Core Ultra 7", "p16s.jpg", "ThinkPad P16s Gen 3", 48900000L, 32, "16\" WUXGA", "p", "Available", "1TB SSD", 2024 },
                    { 9, "Core Ultra 5", "x13.jpg", "ThinkPad X13 Gen 5", 31900000L, 16, "13.3\" WUXGA", "x", "Available", "512GB SSD", 2024 },
                    { 10, "AMD Ryzen 7", "z13.jpg", "ThinkPad Z13 Gen 2", 38900000L, 16, "13.3\" 2.8K OLED", "z", "Available", "512GB SSD", 2023 },
                    { 11, "Core Ultra 5", "thinkbook-14.jpg", "ThinkBook 14 G7", 18900000L, 16, "14\" WUXGA", "thinkbook", "Available", "512GB SSD", 2025 },
                    { 12, "Core i5", "thinkbook-16.jpg", "ThinkBook 16 G6", 15900000L, 8, "16\" WUXGA", "thinkbook", "Borrowed", "512GB SSD", 2022 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Laptops_Name",
                table: "Laptops",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Laptops_SeriesId",
                table: "Laptops",
                column: "SeriesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactMessages");

            migrationBuilder.DropTable(
                name: "Laptops");

            migrationBuilder.DropTable(
                name: "Series");
        }
    }
}
