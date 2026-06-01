import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import taiChinhService from "../services/taiChinhService";

const STATUS_CONFIG = {
  cho_thanh_toan: {
    label: "Chờ thanh toán",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  da_thanh_toan: {
    label: "Đã thanh toán",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
  },
  khau_tru: {
    label: "Đã khấu trừ",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
  },
  dang_xu_ly: {
    label: "Đang xử lý",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
  },
  bi_giu: {
    label: "Bị giữ",
    color: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-400",
  },
};

const WORKFLOW_STEPS = [
  { key: "hoan_tat", label: "Hoàn tất HĐ" },
  { key: "tinh_hh", label: "Tính HH" },
  { key: "cho_duyet", label: "Chờ duyệt" },
  { key: "da_tt", label: "Đã TT" },
];

// ── Helpers ──────────────────────────────────────────────────────────
function formatVND(value) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function MiniSparkline({ data, color = "#2563eb" }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 60;
  const h = 24;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="opacity-30">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// ── KPI Card ─────────────────────────────────────────────────────────
function KPICard({
  icon,
  label,
  value,
  sub,
  color,
  bgColor,
  sparkData,
  sparkColor,
  accent,
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group ${accent ? "border-l-4 border-l-amber-400" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          <span className={color}>{icon}</span>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        {sparkData && <MiniSparkline data={sparkData} color={sparkColor} />}
      </div>
    </div>
  );
}

// ── Workflow timeline ────────────────────────────────────────────────
function WorkflowTimeline({ trangThai }) {
  const statusStepMap = {
    da_thanh_toan: 4,
    khau_tru: 4,
    cho_thanh_toan: 3,
    dang_xu_ly: 2,
    bi_giu: 2,
  };
  const currentStep = statusStepMap[trangThai] || 1;

  return (
    <div className="flex items-center">
      {WORKFLOW_STEPS.map((step, i) => {
        const stepNum = i + 1;
        const isActive = stepNum <= currentStep;
        const isCurrent = stepNum === currentStep;
        const isLast = i === WORKFLOW_STEPS.length - 1;
        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                  isActive
                    ? isCurrent
                      ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                      : "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isActive && !isCurrent ? (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-[9px] mt-1 text-center leading-tight whitespace-nowrap ${isCurrent ? "text-amber-700 font-semibold" : isActive ? "text-blue-600 font-medium" : "text-slate-400"}`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-0.5 rounded-full ${stepNum < currentStep ? "bg-blue-500" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Commission row ───────────────────────────────────────────────────
function CommissionRow({ comm, isSelected, onSelect }) {
  const status = STATUS_CONFIG[comm.trangThai];
  const tenMG = comm.nhanVienMoiGioiHoTen || `MG #${comm.moiGioiId}`;

  return (
    <tr
      onClick={() => onSelect(comm.id)}
      className={`cursor-pointer transition-colors ${isSelected ? "bg-blue-50/60" : "hover:bg-slate-50"}`}
    >
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-blue-600">{comm.ma}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">
              {tenMG
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(-2)}
            </span>
          </div>
          <p className="text-sm text-slate-700">{tenMG}</p>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700">{comm.khachThue}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-600">{comm.chuNha}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-slate-800">
          {formatVND(comm.giaTriHD)}đ
        </p>
        <p className="text-xs text-slate-400">{comm.thoiHan} tháng</p>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm font-semibold text-blue-700">
          {comm.phanTram}%
        </span>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-bold text-emerald-700">
          {formatVND(comm.soTien)}đ
        </p>
      </td>
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </td>
    </tr>
  );
}

// ── Commission detail panel ──────────────────────────────────────────
function CommissionDetail({ comm, onClose, onMarkPaid, actionLoading }) {
  if (!comm) return null;
  const status = STATUS_CONFIG[comm.trangThai];
  const tenMG = comm.nhanVienMoiGioiHoTen || `MG #${comm.moiGioiId}`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-emerald-200 text-xs">Hoa hồng</p>
            <h3 className="text-white font-bold text-lg">{comm.ma}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-medium border ${status.color}`}
          >
            ● {status.label}
          </span>
          <span className="text-emerald-200 text-xs font-medium">
            {formatVND(comm.soTien)}đ
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        {/* Broker */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Môi giới
          </h4>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-bold">
                  {tenMG
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(-2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{tenMG}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contract info */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Thông tin hợp đồng
          </h4>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Mã HĐ</span>
              <Link
                to="/admin/hop-dong-thue"
                className="font-semibold text-blue-700 hover:text-blue-900"
              >
                {comm.hopDong}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Khách thuê</span>
              <span className="font-medium text-slate-800">
                {comm.khachThue}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Chủ nhà</span>
              <span className="font-medium text-slate-800">{comm.chuNha}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Giá trị HĐ</span>
              <span className="font-semibold text-slate-800">
                {formatVND(comm.giaTriHD)}đ/tháng
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Thời hạn</span>
              <span className="font-medium text-slate-800">
                {comm.thoiHan} tháng
              </span>
            </div>
          </div>
        </div>

        {/* Commission calculation */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Tính hoa hồng
          </h4>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Giá trị HĐ/năm</span>
              <span className="font-medium text-slate-800">
                {formatVND(comm.giaTriHD * comm.thoiHan)}đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tỷ lệ HH</span>
              <span className="font-semibold text-blue-700">
                {comm.phanTram}%
              </span>
            </div>
            <div className="border-t border-emerald-200 pt-2 flex justify-between">
              <span className="font-semibold text-slate-700">Số tiền HH</span>
              <span className="text-lg font-bold text-emerald-700">
                {formatVND(comm.soTien)}đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Khấu trừ đảm bảo</span>
              <span className="font-medium text-orange-700">
                {formatVND(comm.soTienKhauTru || 0)}đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Thực nhận</span>
              <span className="font-semibold text-emerald-800">
                {formatVND(comm.soTienThucNhan || 0)}đ
              </span>
            </div>
          </div>
        </div>

        {/* Payment workflow */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Quy trình thanh toán
          </h4>
          <WorkflowTimeline trangThai={comm.trangThai} />
        </div>

        {/* Notes */}
        {comm.ghiChu && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Ghi chú
            </h4>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 text-sm text-amber-800">
              {comm.ghiChu}
            </div>
          </div>
        )}

        {/* Dates */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Thời gian
          </h4>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Ngày tạo</span>
              <span className="text-slate-700">{formatDate(comm.ngayTao)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Ngày thanh toán</span>
              <span className="text-slate-700">
                {formatDate(comm.ngayThanhToan)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 pt-4 space-y-2">
          {(comm.trangThai === "cho_thanh_toan" ||
            comm.trangThai === "khau_tru") && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkPaid(comm.id);
              }}
              disabled={actionLoading === comm.id}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {actionLoading === comm.id && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Duyệt thanh toán
            </button>
          )}
          <Link
            to="/admin/hop-dong-thue"
            className="block w-full bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 py-2.5 rounded-xl text-sm font-semibold transition-colors text-center"
          >
            Xem hợp đồng
          </Link>
        </div>
      </div>
    </div>
  );
}

function mapApiCommissionToLocal(c) {
  const trangThaiMap = {
    CHUA_THANH_TOAN: "cho_thanh_toan",
    DA_THANH_TOAN: "da_thanh_toan",
    KHAU_TRU: "khau_tru",
  };
  const tyLe = Number(c.tyLeHoaHong ?? 0);
  return {
    id: c.id,
    ma: `HH-${String(c.id).padStart(4, "0")}`,
    moiGioiId: c.nhanVienMoiGioiId,
    hopDong: `HĐT-${String(c.hopDongThueId).padStart(4, "0")}`,
    khachThue: c.khachHangHoTen || "—",
    chuNha: c.chuNhaHoTen || "—",
    giaTriHD: Number(c.soTienHopDong || 0),
    thoiHan: 12,
    phanTram: tyLe > 0 && tyLe < 1 ? tyLe * 100 : tyLe,
    soTien: Number(c.soTienHoaHong || 0),
    trangThai: trangThaiMap[c.trangThaiThanhToan] || "cho_thanh_toan",
    ngayTao: c.ngayTinh || "",
    ngayThanhToan: c.ngayThanhToan || null,
    ghiChu:
      c.trangThaiThanhToan === "KHAU_TRU" ? "Đã khấu trừ tiền đảm bảo" : "",
    soTienKhauTru: Number(c.soTienKhauTru),
    soTienThucNhan: Number(c.soTienThucNhan),
    nhanVienMoiGioiHoTen: c.nhanVienMoiGioiHoTen,
    batDongSanDiaChi: c.batDongSanDiaChi || "—",
  };
}

// ── Main page ────────────────────────────────────────────────────────
export default function HoaHongPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("newest");
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showTinhModal, setShowTinhModal] = useState(false);
  const [eligibleContracts, setEligibleContracts] = useState([]);
  const [selectedHopDongThueId, setSelectedHopDongThueId] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taiChinhService.layDanhSachHoaHong();
      if (res?.data && Array.isArray(res.data)) {
        setCommissions(res.data.map(mapApiCommissionToLocal));
      } else {
        setCommissions([]);
      }
    } catch (err) {
      console.error("Failed to fetch commissions:", err);
      setError("Không thể tải danh sách hoa hồng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    taiChinhService
      .layDanhSachHoaHong()
      .then((res) => {
        if (ignore) return;
        if (res?.data && Array.isArray(res.data)) {
          setCommissions(res.data.map(mapApiCommissionToLocal));
        } else {
          setCommissions([]);
        }
      })
      .catch((err) => {
        if (ignore) return;
        console.error("Failed to fetch commissions:", err);
        setError("Không thể tải danh sách hoa hồng");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleThanhToan = useCallback(
    async (id) => {
      setActionLoading(id);
      try {
        await taiChinhService.danhDauThanhToan(id);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || "Cập nhật thanh toán thất bại");
      } finally {
        setActionLoading(null);
      }
    },
    [fetchData],
  );

  const handleTinhHoaHong = useCallback(
    async (hopDongThueId) => {
      setActionLoading("tinh");
      try {
        await taiChinhService.tinhHoaHong(hopDongThueId);
        fetchData();
        setShowTinhModal(false);
        setSelectedHopDongThueId("");
      } catch (err) {
        alert(err.response?.data?.message || "Tính hoa hồng thất bại");
      } finally {
        setActionLoading(null);
      }
    },
    [fetchData],
  );

  const openTinhModal = useCallback(async () => {
    setShowTinhModal(true);
    setEligibleContracts([]);
    setSelectedHopDongThueId("");
    setActionLoading("load-contracts");
    setError(null);
    try {
      const res = await taiChinhService.layHopDongThueChoTinhHoaHong();
      const contracts = Array.isArray(res?.data) ? res.data : [];
      setEligibleContracts(contracts);
      setSelectedHopDongThueId(
        contracts[0]?.hopDongThueId ? String(contracts[0].hopDongThueId) : "",
      );
    } catch (err) {
      console.error("Failed to load commission contracts:", err);
      setError("Không thể tải hợp đồng thuê chờ tính hoa hồng");
    } finally {
      setActionLoading(null);
    }
  }, []);

  const handleExport = useCallback(async () => {
    setActionLoading("export");
    try {
      const blob = await taiChinhService.xuatHoaHongCsv();
      downloadBlob(blob, "hoa-hong.csv");
    } catch (err) {
      alert(err.response?.data?.message || "Xuất báo cáo thất bại");
    } finally {
      setActionLoading(null);
    }
  }, []);

  const selectedComm = useMemo(
    () => commissions.find((c) => c.id === selectedId),
    [selectedId, commissions],
  );

  const filtered = useMemo(() => {
    let list = [...commissions];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.ma.toLowerCase().includes(q) ||
          c.hopDong.toLowerCase().includes(q) ||
          (c.nhanVienMoiGioiHoTen || "").toLowerCase().includes(q),
      );
    }
    if (filterStatus !== "Tất cả") {
      const statusMap = {
        "Chờ thanh toán": "cho_thanh_toan",
        "Đã thanh toán": "da_thanh_toan",
        "Đang xử lý": "dang_xu_ly",
        "Bị giữ": "bi_giu",
      };
      list = list.filter((c) => c.trangThai === statusMap[filterStatus]);
    }
    switch (sortBy) {
      case "newest":
        list.sort((a, b) => b.id - a.id);
        break;
      case "oldest":
        list.sort((a, b) => a.id - b.id);
        break;
      case "amount_desc":
        list.sort((a, b) => b.soTien - a.soTien);
        break;
      case "amount_asc":
        list.sort((a, b) => a.soTien - b.soTien);
        break;
    }
    return list;
  }, [search, filterStatus, sortBy, commissions]);

  const kpi = useMemo(() => {
    const totalHH = commissions.reduce((s, c) => s + c.soTien, 0);
    const totalDT = commissions.reduce((s, c) => s + c.giaTriHD * c.thoiHan, 0);
    const successHD = commissions.filter(
      (c) => c.trangThai === "da_thanh_toan",
    ).length;
    return { totalHH, totalDT, successHD };
  }, [commissions]);

  const handleSelectComm = (id) => {
    setSelectedId(id);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Quản lý hoa hồng môi giới
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi doanh thu và hoa hồng từ các hợp đồng thuê
          </p>
        </div>
        <div className="flex items-center gap-3">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Đang tải...
            </div>
          )}
          <button
            onClick={openTinhModal}
            disabled={actionLoading === "tinh"}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0"
          >
            {actionLoading === "tinh" ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            )}
            Tính hoa hồng
          </button>
          <button
            onClick={handleExport}
            disabled={actionLoading === "export"}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 disabled:bg-slate-100 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPI cards */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          label="Tổng hoa hồng"
          value={`${formatVND(kpi.totalHH)}đ`}
          color="text-emerald-600"
          bgColor="bg-emerald-100"
        />
        <KPICard
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
          label="Tổng doanh thu"
          value={`${formatVND(kpi.totalDT)}đ`}
          sub="Giá trị hợp đồng"
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <KPICard
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          label="HĐ thành công"
          value={kpi.successHD}
          color="text-violet-600"
          bgColor="bg-violet-100"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã HH, hợp đồng, môi giới..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option>Tất cả</option>
              <option>Chờ thanh toán</option>
              <option>Đã thanh toán</option>
              <option>Đang xử lý</option>
              <option>Bị giữ</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="amount_desc">Số tiền cao nhất</option>
              <option value="amount_asc">Số tiền thấp nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content: table + detail */}
      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Mã HH
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Môi giới
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Khách thuê
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Chủ nhà
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Giá trị HĐ
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      % HH
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Số tiền HH
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <svg
                            className="w-12 h-12 text-slate-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-sm text-slate-400">
                            Không tìm thấy hoa hồng nào
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c) => (
                      <CommissionRow
                        key={c.id}
                        comm={c}
                        isSelected={selectedId === c.id}
                        onSelect={handleSelectComm}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {selectedId && (
          <div className="hidden xl:block w-105 shrink-0">
            <CommissionDetail
              comm={selectedComm}
              onClose={() => setSelectedId(null)}
              onMarkPaid={handleThanhToan}
              actionLoading={actionLoading}
            />
          </div>
        )}
      </div>

      {showTinhModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Tính hoa hồng
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Hợp đồng thuê đã ký/chưa có hoa hồng
                </label>
                <select
                  value={selectedHopDongThueId}
                  onChange={(e) => setSelectedHopDongThueId(e.target.value)}
                  disabled={actionLoading === "load-contracts"}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- Chọn hợp đồng --</option>
                  {eligibleContracts.map((contract) => (
                    <option
                      key={contract.hopDongThueId}
                      value={contract.hopDongThueId}
                    >
                      HĐT-{String(contract.hopDongThueId).padStart(4, "0")} -{" "}
                      {contract.batDongSanDiaChi || "BĐS"} -{" "}
                      {Number(contract.tienThue || contract.tienThueThang || 0).toLocaleString()}
                      đ/tháng
                    </option>
                  ))}
                </select>
              </div>
              {actionLoading === "load-contracts" && (
                <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
                  Đang tải danh sách hợp đồng thuê chờ tính hoa hồng...
                </div>
              )}
              {eligibleContracts.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                  Không có hợp đồng thuê nào chờ tính hoa hồng.
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowTinhModal(false);
                  setSelectedHopDongThueId("");
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() =>
                  handleTinhHoaHong(parseInt(selectedHopDongThueId, 10))
                }
                disabled={actionLoading === "tinh" || !selectedHopDongThueId}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg text-sm font-medium"
              >
                Xác nhận tính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
