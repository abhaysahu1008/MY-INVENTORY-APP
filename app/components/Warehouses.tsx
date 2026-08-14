import React from 'react';
import { prisma } from '../lib/prisma';

interface WarehousesProps {
  companyId: number;
  companySlug: string;
}

const Warehouses = async ({ companyId, companySlug }: WarehousesProps) => {
  const allWarehouses = await prisma.warehouse.findMany({
    where: {
      companyId: companyId,
    },
  });

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-zinc-100">
            Warehouses
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Active facilities registered under : <span className="text-yellow-200 font-semibold">{companySlug}</span>
          </p>
        </div>
        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400 border border-yellow-500/20">
          Total: {allWarehouses.length}
        </span>
      </div>

      {/* Empty State */}
      {allWarehouses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 p-8 text-center">
          <div className="text-3xl mb-2">🏭</div>
          <p className="text-sm font-medium text-zinc-300">No warehouses added yet</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs">
            Add your first warehouse location to start managing inventory and stock.
          </p>
        </div>
      ) : (
        /* Grid of Warehouse Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allWarehouses.map((warehouse) => (
            <div
              key={warehouse.id}
              className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-zinc-700 hover:shadow-lg space-y-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🏭</span>
                  <h4 className="font-bold text-zinc-100 text-base leading-tight">
                    {warehouse.name}
                  </h4>
                </div>

                <div className="space-y-2 text-xs text-zinc-400 mt-3">
                  <div className="flex items-start gap-2">
                    <span className="text-zinc-500 shrink-0">📍</span>
                    <span className="text-zinc-300">
                      {warehouse.address || "No address provided"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 shrink-0">📞</span>
                    <span className="text-zinc-300">
                      {warehouse.phone || "No phone number"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Status: <span className="text-emerald-400 font-medium">Active</span></span>
                <span>ID: #{warehouse.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Warehouses;
