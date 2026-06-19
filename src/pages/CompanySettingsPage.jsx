import { useEffect, useState } from "react";
import {
  getCompany,
  createCompany,
  updateCompany,
} from "../services/api";

const BASE_MEDIA = "http://192.168.1.95:8000";

export default function CompanySettingsPage() {
  const [loading, setLoading] = useState(true);

  const [companyId, setCompanyId] = useState(null);

  const [logo, setLogo] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  const [form, setForm] = useState({
    company_name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    loadCompany();
  }, []);

  async function loadCompany() {
    try {
      const data = await getCompany();

      const company = Array.isArray(data)
        ? data[0]
        : data;

      if (company) {
        setCompanyId(company.id);

        setForm({
          company_name: company.company_name || "",
          address: company.address || "",
          phone: company.phone || "",
          email: company.email || "",
          website: company.website || "",
        });
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append(
        "company_name",
        form.company_name
      );

      formData.append(
        "address",
        form.address
      );

      formData.append(
        "phone",
        form.phone
      );

      formData.append(
        "email",
        form.email
      );

      formData.append(
        "website",
        form.website
      );

      if (logo) {
        formData.append("logo", logo);
      }

      if (qrCode) {
        formData.append("qr_code", qrCode);
      }

      if (companyId) {
        await updateCompany(
          companyId,
          formData
        );
      } else {
        await createCompany(
          formData
        );
      }

      alert(
        "Company Details Saved Successfully"
      );

      loadCompany();
    } catch (err) {
      console.error(err);

      alert(
        "Failed To Save Company Details"
      );
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-8">

      <div className="max-w-5xl mx-auto">

        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            Company Settings
          </h1>

          <p className="text-gray-400 mt-3">
            Manage company details for invoices and billing
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
        >

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 text-gray-300">
                Company Name
              </label>

              <input
                type="text"
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                className="w-full bg-black border border-gray-700 rounded-xl p-4"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-black border border-gray-700 rounded-xl p-4"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-black border border-gray-700 rounded-xl p-4"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">
                Website
              </label>

              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                className="w-full bg-black border border-gray-700 rounded-xl p-4"
              />
            </div>

          </div>

          <div className="mt-6">
            <label className="block mb-2 text-gray-300">
              Address
            </label>

            <textarea
              rows="4"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full bg-black border border-gray-700 rounded-xl p-4"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8">

            <div>
              <label className="block mb-3 text-gray-300">
                Company Logo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setLogo(e.target.files[0])
                }
              />
            </div>

            <div>
              <label className="block mb-3 text-gray-300">
                Payment QR Code
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setQrCode(e.target.files[0])
                }
              />
            </div>

          </div>

          <button
            type="submit"
            className="mt-10 bg-cyan-500 hover:bg-cyan-600 px-10 py-4 rounded-2xl font-bold"
          >
            Save Company Details
          </button>

        </form>

      </div>

    </div>
  );
}