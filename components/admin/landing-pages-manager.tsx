"use client"

import { FileText, Plus, Search } from "lucide-react"
import { useState } from "react"
import { LandingPageForm } from "./landing-page-form"

export function LandingPagesManager() {
  const [filter, setFilter] = useState("")
  const [isCreatingPage, setIsCreatingPage] = useState(false)

  if (isCreatingPage) {
    return <LandingPageForm onCancel={() => setIsCreatingPage(false)} />
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#f5f7fa] -m-8 p-5 text-[#172b4d]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="mt-1 text-lg text-[#71839e]">
            Manage your website hierarchy and content structure.
          </p>
        </div>
        <button
          onClick={() => setIsCreatingPage(true)}
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-[#FCC50E] px-4 py-2 text-sm font-semibold text-black transition-colors "
        >
          <Plus size={16} />
          New page
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dce4ee] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5ebf2] p-3.5">
          <label className="flex w-full max-w-sm items-center gap-2 rounded-md bg-[#f5f7fa] px-3 py-2 text-[#91a2ba]">
            <Search size={16} />
            <input
              aria-label="Filter pages"
              className="w-full bg-transparent text-sm text-[#172b4d] outline-none placeholder:text-[#91a2ba]"
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Filter pages..."
              value={filter}
            />
          </label>
          <span className="text-sm text-[#91a2ba]">0 pages</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed text-left">
            <thead className="border-b border-[#e5ebf2] bg-[#fbfcfd] text-xs font-semibold uppercase tracking-wide text-[#71839e]">
              <tr>
                <th className="w-[33%] px-5 py-3">Page</th>
                <th className="w-[19%] px-4 py-3">Route</th>
                <th className="w-[9%] px-4 py-3">Status</th>
                <th className="w-[9%] px-4 py-3">SEO</th>
                <th className="w-[9%] px-4 py-3 text-center">Sections</th>
                <th className="w-[14%] px-4 py-3">Updated</th>
                <th className="w-[7%] px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-5 py-20 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f0f4f8] text-[#91a8c1]">
                      <FileText size={22} />
                    </div>
                    <p className="font-semibold text-[#334663]">
                      {filter ? "No pages match your filter" : "No landing pages yet"}
                    </p>
                    <p className="mt-1 text-sm text-[#91a2ba]">
                      {filter
                        ? "Try a different search term."
                        : "Create a landing page to get started."}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
