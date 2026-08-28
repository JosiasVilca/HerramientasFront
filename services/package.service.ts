import { fetchFromAPI } from "@/lib/api-client";
import { PackageItem, CreatePackageDTO, UpdatePackageStatusDTO, PackageStatus } from "@/types/package";

let MOCK_PACKAGES: PackageItem[] = [
  {
    id: 1,
    trackingCode: "SW-9843-XY",
    senderName: "Distribuidora Andina S.A.",
    senderPhone: "+51987654321",
    receiverName: "Josías Vilca",
    receiverPhone: "+51912345678",
    originCity: "Lima",
    destinationCity: "Arequipa",
    destinationAddress: "Av. Ejercito 450, Yanahuara",
    weightKg: 4.5,
    status: "EN_TRANSITO",
    description: "Componentes electrónicos frágiles",
    createdAt: "2026-08-27 08:30",
    updatedAt: "2026-08-28 10:15",
  },
  {
    id: 2,
    trackingCode: "TRK-1111-AA",
    senderName: "Calzados del Norte",
    senderPhone: "+51933445566",
    receiverName: "María Rojas",
    receiverPhone: "+51977889900",
    originCity: "Trujillo",
    destinationCity: "Lima",
    destinationAddress: "Calle Las Flores 123, San Isidro",
    weightKg: 1.2,
    status: "ENTREGADO",
    description: "Zapatos de cuero marrón",
    createdAt: "2026-08-25 09:00",
    updatedAt: "2026-08-26 14:20",
  },
  {
    id: 3,
    trackingCode: "SW-4321-LZ",
    senderName: "Josías Vilca",
    senderPhone: "+51912345678",
    receiverName: "Distribuidora Andina S.A.",
    receiverPhone: "+51987654321",
    originCity: "Arequipa",
    destinationCity: "Lima",
    destinationAddress: "Av. Argentina 1400, Callao",
    weightKg: 12.0,
    status: "EN_ALMACEN",
    description: "Retorno de repuestos defectuosos",
    createdAt: "2026-08-28 07:15",
    updatedAt: "2026-08-28 07:15",
  },
  {
    id: 4,
    trackingCode: "SW-8877-QR",
    senderName: "Importaciones Lima",
    senderPhone: "+51955223344",
    receiverName: "Luis Benavides",
    receiverPhone: "+51944112233",
    originCity: "Lima",
    destinationCity: "Cusco",
    destinationAddress: "Plaza de Armas 12, Cusco",
    weightKg: 2.8,
    status: "REGISTRADO",
    description: "Libros y material educativo",
    createdAt: "2026-08-28 11:30",
    updatedAt: "2026-08-28 11:30",
  },
  {
    id: 5,
    trackingCode: "SW-5566-ER",
    senderName: "TechStore Sac",
    senderPhone: "+51999888777",
    receiverName: "Juan Carlos Baca",
    receiverPhone: "+51966555444",
    originCity: "Lima",
    destinationCity: "Piura",
    destinationAddress: "Av. Grau 820, Piura",
    weightKg: 0.5,
    status: "INCIDENCIA",
    description: "Auriculares inalámbricos",
    createdAt: "2026-08-26 10:00",
    updatedAt: "2026-08-27 09:10",
  },
];

export const packageService = {
  getAll: async (search = "", statusFilter = ""): Promise<PackageItem[]> => {
    try {
      let queryParams = "";
      if (search || statusFilter) {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (statusFilter) params.append("status", statusFilter);
        queryParams = `?${params.toString()}`;
      }
      return await fetchFromAPI<PackageItem[]>(`/api/v1/packages${queryParams}`, {
        method: "GET",
      });
    } catch (error) {
      console.warn("Backend REST API offline. Using local packages database.", error);
      
      let filtered = [...MOCK_PACKAGES];
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.trackingCode.toLowerCase().includes(searchLower) ||
            p.senderName.toLowerCase().includes(searchLower) ||
            p.receiverName.toLowerCase().includes(searchLower)
        );
      }
      if (statusFilter && statusFilter !== "ALL") {
        filtered = filtered.filter((p) => p.status === statusFilter);
      }
      
      return filtered;
    }
  },

  create: async (dto: CreatePackageDTO): Promise<PackageItem> => {
    try {
      return await fetchFromAPI<PackageItem>("/api/v1/packages", {
        method: "POST",
        body: JSON.stringify(dto),
      });
    } catch (error) {
      console.warn("Backend REST API offline. Mocking package creation.", error);
      
      const newCode = `SW-${Math.floor(1000 + Math.random() * 9000)}-${Array.from({ length: 2 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join("")}`;
      
      const now = new Date().toISOString().replace("T", " ").substring(0, 16);
      
      const newPackage: PackageItem = {
        id: MOCK_PACKAGES.length + 1,
        trackingCode: newCode,
        senderName: dto.senderName,
        senderPhone: dto.senderPhone,
        receiverName: dto.receiverName,
        receiverPhone: dto.receiverPhone,
        originCity: "Lima", // Assuming origin Hub
        destinationCity: dto.destinationCity,
        destinationAddress: dto.destinationAddress,
        weightKg: dto.weightKg,
        status: "REGISTRADO",
        description: dto.description,
        createdAt: now,
        updatedAt: now,
      };
      
      MOCK_PACKAGES = [newPackage, ...MOCK_PACKAGES];
      return newPackage;
    }
  },

  getById: async (id: number): Promise<PackageItem> => {
    try {
      return await fetchFromAPI<PackageItem>(`/api/v1/packages/${id}`, {
        method: "GET",
      });
    } catch (error) {
      console.warn(`Backend REST API offline. Reading package ${id} from mock.`, error);
      const pkg = MOCK_PACKAGES.find((p) => p.id === id);
      if (pkg) return pkg;
      throw new Error(`Package with ID ${id} not found.`);
    }
  },

  updateStatus: async (dto: UpdatePackageStatusDTO): Promise<PackageItem> => {
    try {
      return await fetchFromAPI<PackageItem>(`/api/v1/packages/${dto.packageId}/status`, {
        method: "PATCH",
        body: JSON.stringify(dto),
      });
    } catch (error) {
      console.warn(`Backend REST API offline. Mocking status update for package ${dto.packageId}.`, error);
      
      const pkgIdx = MOCK_PACKAGES.findIndex((p) => p.id === dto.packageId);
      if (pkgIdx === -1) {
        throw new Error(`Package with ID ${dto.packageId} not found.`);
      }
      
      const now = new Date().toISOString().replace("T", " ").substring(0, 16);
      const updatedPackage = {
        ...MOCK_PACKAGES[pkgIdx],
        status: dto.newStatus,
        updatedAt: now,
      };
      
      MOCK_PACKAGES[pkgIdx] = updatedPackage;
      return updatedPackage;
    }
  },

  getByTrackingCode: async (code: string): Promise<PackageItem> => {
    try {
      return await fetchFromAPI<PackageItem>(`/api/v1/packages/track/${code}`, {
        method: "GET",
      });
    } catch (error) {
      const pkg = MOCK_PACKAGES.find((p) => p.trackingCode.toUpperCase() === code.toUpperCase());
      if (pkg) return pkg;
      throw new Error(`Guía ${code} no encontrada.`);
    }
  },
};
