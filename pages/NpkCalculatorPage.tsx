
import React, { useState, useMemo } from 'react';
import Card from '../components/Card';

const NpkCalculatorPage: React.FC = () => {
    const [targetN, setTargetN] = useState<number>(10);
    const [targetP, setTargetP] = useState<number>(10);
    const [targetK, setTargetK] = useState<number>(5);
    const [totalWeight, setTotalWeight] = useState<number>(100);
    
    // Đơn chất ví dụ
    const urea = { name: 'Ure', n: 46, p: 0, k: 0 };
    const dap = { name: 'DAP', n: 18, p: 46, k: 0 };
    const kcl = { name: 'KCl', n: 0, p: 0, k: 60 };

    const result = useMemo(() => {
        // This is a simplified calculation and may not be perfectly accurate for all combinations.
        // A real-world calculator would require a more complex algorithm (e.g., linear programming).
        const neededK = (targetK / 100) * totalWeight;
        const kclWeight = (neededK / kcl.k) * 100;

        const neededP = (targetP / 100) * totalWeight;
        const dapWeight = (neededP / dap.p) * 100;
        
        const nFromDap = (dapWeight * dap.n) / 100;
        const neededN = (targetN / 100) * totalWeight;
        const remainingN = neededN - nFromDap;

        if (remainingN < 0) {
            return { error: 'Không thể phối trộn với tỷ lệ này bằng các đơn chất đã cho.' };
        }
        
        const ureaWeight = (remainingN / urea.n) * 100;
        
        const fillerWeight = totalWeight - kclWeight - dapWeight - ureaWeight;

        if (fillerWeight < 0) {
            return { error: 'Tổng lượng đơn chất vượt quá khối lượng cần trộn.' };
        }

        return {
            urea: ureaWeight.toFixed(2),
            dap: dapWeight.toFixed(2),
            kcl: kclWeight.toFixed(2),
            filler: fillerWeight.toFixed(2),
        };

    }, [targetN, targetP, targetK, totalWeight]);

    return (
        <div className="space-y-4">
            <Card>
                <div className="p-4">
                    <h3 className="font-semibold mb-2">Công thức NPK mục tiêu</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block text-sm">N (%)</label>
                            <input type="number" value={targetN} onChange={e => setTargetN(Number(e.target.value))} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm">P₂O₅ (%)</label>
                            <input type="number" value={targetP} onChange={e => setTargetP(Number(e.target.value))} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm">K₂O (%)</label>
                            <input type="number" value={targetK} onChange={e => setTargetK(Number(e.target.value))} className="w-full p-2 border rounded-md" />
                        </div>
                    </div>
                     <div className="mt-4">
                        <label className="block text-sm">Tổng khối lượng (kg)</label>
                        <input type="number" value={totalWeight} onChange={e => setTotalWeight(Number(e.target.value))} className="w-full p-2 border rounded-md" />
                    </div>
                </div>
            </Card>

            <Card>
                <div className="p-4">
                    <h3 className="font-semibold mb-2">Kết quả phối trộn (kg)</h3>
                    {result.error ? (
                        <p className="text-red-500">{result.error}</p>
                    ) : (
                        <ul className="space-y-2">
                            <li className="flex justify-between"><span>Phân Ure (46% N):</span> <span className="font-mono">{result.urea}</span></li>
                            <li className="flex justify-between"><span>Phân DAP (18-46-0):</span> <span className="font-mono">{result.dap}</span></li>
                            <li className="flex justify-between"><span>Phân KCl (60% K₂O):</span> <span className="font-mono">{result.kcl}</span></li>
                            <li className="flex justify-between border-t pt-2 mt-2"><span>Chất độn/phụ gia:</span> <span className="font-mono">{result.filler}</span></li>
                        </ul>
                    )}
                     <p className="text-xs text-gray-500 mt-4">*Lưu ý: Kết quả chỉ mang tính tham khảo, dựa trên các đơn chất phổ biến.</p>
                </div>
            </Card>
        </div>
    );
};

export default NpkCalculatorPage;
