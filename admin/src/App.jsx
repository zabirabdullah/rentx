import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/flats";
const USERS_API_URL = "http://localhost:5000/api/users";

const initialFormState = {
  ownerId: "",
  address: "",
  name: "",
  number: "",
  holdingNo: "",
  type: "house",
  area: "",
  price: "",
  service: "",
  bedroom: "1",
  bathroom: "1",
  balcony: "0",
  storey: "",
  position: "",
  description: "",
  isAvailable: true,
};

function App() {
  const [flats, setFlats] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState("");
  const [ownerSearchQuery, setOwnerSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef(null);
  const listRef = useRef(null);

  const loadFlats = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setFlats(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message || "Failed to load flats");
    } finally {
      setLoading(false);
    }
  };

  const formatUserDisplay = (user) => {
    if (!user) return "Unknown";
    if (typeof user === "string") return user.includes("@") ? user.split("@")[0] : "Unknown";

    const name = user.name || (user.email ? user.email.split("@")[0] : "Unknown");
    const phone = user.phone || "";

    return phone ? `${name}(${phone})` : name;
  };

  const getOwnerDisplay = (owner) => {
    if (!owner) return "Unknown";
    if (typeof owner === "string") {
      const matchedUser = users.find((user) => (user._id || user.id) === owner);
      if (matchedUser) {
        return formatUserDisplay(matchedUser);
      }
      return owner.includes("@") ? owner.split("@")[0] : "Unknown";
    }

    const name = owner.name || (owner.email ? owner.email.split("@")[0] : "Unknown");
    const phone = owner.phone || "";

    return phone ? `${name}(${phone})` : name;
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(USERS_API_URL);
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message || "Failed to load users");
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([loadFlats(), loadUsers()]);
    };

    void initialize();
  }, []);

  const stats = useMemo(() => {
    const total = flats.length;
    const available = flats.filter((flat) => flat.isAvailable).length;
    const unavailable = total - available;

    return [
      { label: "All Flats", value: total },
      { label: "Available", value: available },
      { label: "Unavailable", value: unavailable },
    ];
  }, [flats]);

  const visibleFlats = useMemo(() => {
    let filtered = flats;

    if (selectedOwnerId) {
      filtered = filtered.filter((flat) => {
        const ownerValue = flat.ownerId?._id || flat.ownerId;
        return ownerValue === selectedOwnerId;
      });
    }

    return filtered;
  }, [flats, selectedOwnerId]);

  const ownerOptions = useMemo(
    () => users.filter((user) => user.role === "owner"),
    [users],
  );

  const filteredOwnerOptions = useMemo(() => {
    if (!ownerSearchQuery.trim()) {
      return ownerOptions;
    }
    const query = ownerSearchQuery.toLowerCase();
    return ownerOptions.filter((user) => {
      const name = (user.name || "").toLowerCase();
      const phone = (user.phone || "").toLowerCase();
      return name.includes(query) || phone.includes(query);
    });
  }, [ownerOptions, ownerSearchQuery]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
  };

  const handleAddFlatClick = () => {
    resetForm();
    setOwnerSearchQuery("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShowAllFlats = () => {
    setMessage("Showing all flats.");
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleOwnerFilterChange = (event) => {
    setSelectedOwnerId(event.target.value);
    setMessage(event.target.value ? "Filtered by owner." : "Showing all owners.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    // Ensure owner is selected and registered
    if (!form.ownerId) {
      setMessage("Please select a registered owner before adding a flat.");
      setSaving(false);
      return;
    }

    const ownerExists = ownerOptions.find((u) => (u._id || u.id) === form.ownerId);
    if (!ownerExists) {
      setMessage("Selected owner is not registered. Please add the owner first.");
      setSaving(false);
      return;
    }
    const payload = {
      ...form,
    };

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Unable to save flat");
      }

      await loadFlats();
      resetForm();
      setOwnerSearchQuery("");
      setMessage(editingId ? "Flat updated." : "Flat added.");
    } catch (error) {
      setMessage(error.message || "Unable to save flat");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (flat) => {
    setEditingId(flat._id);
    setForm({
      ownerId: flat.ownerId?._id || flat.ownerId || "",
      address: flat.address || "",
      name: flat.name || "",
      number: flat.number || "",
      holdingNo: flat.holdingNo || "",
      type: flat.type || "house",
      area: flat.area?.toString() || "",
      price: flat.price?.toString() || "",
      service: flat.service?.toString() || "",
      bedroom: flat.bedroom?.toString() || "1",
      bathroom: flat.bathroom?.toString() || "1",
      balcony: flat.balcony?.toString() || "0",
      storey: flat.storey?.toString() || "",
      position: flat.position || "",
      description: flat.description || "",
      isAvailable: Boolean(flat.isAvailable),
    });
    setMessage("Editing selected flat.");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this flat?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Unable to delete flat");
      }

      await loadFlats();
      if (editingId === id) {
        resetForm();
      }
      setMessage("Flat deleted.");
    } catch (error) {
      setMessage(error.message || "Unable to delete flat");
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-backdrop" aria-hidden="true" />

      <div className="admin-layout">
        <header className="topbar glass-panel">
          <div>
            <p className="eyebrow">RentX Admin</p>
            <h1>Flat Management</h1>
          </div>
          <div className="topbar-actions">
            <button type="button" className="primary-button" onClick={handleAddFlatClick}>
              Add Flat
            </button>
            <button type="button" className="ghost-button" onClick={handleShowAllFlats}>
              Show All Flats
            </button>
          </div>
        </header>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card glass-panel">
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <form className="form-panel glass-panel" onSubmit={handleSubmit} ref={formRef}>
            <div className="section-header">
              <div>
                <p className="eyebrow">{editingId ? "Update flat" : "Add flat"}</p>
                <h2>{editingId ? "Edit flat details" : "Create new flat"}</h2>
              </div>
            </div>

            <div className="form-grid">
              <label className="span-2">
                Owner
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={ownerSearchQuery}
                  onChange={(e) => setOwnerSearchQuery(e.target.value)}
                />
                <select name="ownerId" value={form.ownerId} onChange={handleChange} required>
                  <option value="">Select owner</option>
                  {filteredOwnerOptions.length > 0 ? (
                    filteredOwnerOptions.map((user) => (
                      <option key={user._id} value={user._id}>
                        {formatUserDisplay(user)}
                      </option>
                    ))
                  ) : (
                    <option disabled>No owners found</option>
                  )}
                </select>
              </label>
              <label>
                Flat Name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label className="span-2">
                Address
                <input name="address" value={form.address} onChange={handleChange} required />
              </label>
              <label>
                Holding No
                <input name="holdingNo" value={form.holdingNo} onChange={handleChange} required />
              </label>
              <label>
                Flat Type
                <select name="type" value={form.type} onChange={handleChange} required>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                </select>
              </label>
              <label>
                Area
                <input name="area" value={form.area} onChange={handleChange} type="number" required />
              </label>
              <label>
                Price
                <input name="price" value={form.price} onChange={handleChange} type="number" required />
              </label>
              <label>
                Service
                <input name="service" value={form.service} onChange={handleChange} type="number" required />
              </label>
              <label>
                Bedroom
                <input name="bedroom" value={form.bedroom} onChange={handleChange} type="number" />
              </label>
              <label>
                Bathroom
                <input name="bathroom" value={form.bathroom} onChange={handleChange} type="number" />
              </label>
              <label>
                Balcony
                <input name="balcony" value={form.balcony} onChange={handleChange} type="number" />
              </label>
              <label>
                Storey
                <input name="storey" value={form.storey} onChange={handleChange} type="number" required />
              </label>
              <label>
                Position
                <input name="position" value={form.position} onChange={handleChange} required />
              </label>
              <label className="span-2">
                Description
                <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
              </label>
              <label className="checkbox-row">
                <input name="isAvailable" checked={form.isAvailable} onChange={handleChange} type="checkbox" />
                Available
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Flat" : "Add Flat"}
              </button>
              {editingId ? (
                <button type="button" className="ghost-button" onClick={resetForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>

            {message ? <p className="message-line">{message}</p> : null}
          </form>

          <section className="list-panel glass-panel" ref={listRef}>
            <div className="section-header">
              <div>
                <p className="eyebrow">Flat list</p>
                <h2>All flats</h2>
              </div>
              <div className="list-controls">
                <select value={selectedOwnerId} onChange={handleOwnerFilterChange}>
                  <option value="">All owners</option>
                  {ownerOptions.map((user) => (
                    <option key={user._id} value={user._id}>
                      {formatUserDisplay(user)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? <p className="empty-state">Loading flats...</p> : null}

            {!loading && visibleFlats.length === 0 ? (
              <p className="empty-state">No flats found.</p>
            ) : null}

            <div className="flat-cards">
              {visibleFlats.map((flat) => (
                <article key={flat._id} className="flat-row glass-panel">
                  <div className="flat-row-main">
                    <div>
                      <p className="flat-row-label">Name</p>
                      <h3>{flat.name}</h3>
                      <p className="flat-row-owner">
                        Owner: {getOwnerDisplay(flat.ownerId)}
                      </p>
                    </div>
                    <span className={`table-badge ${flat.isAvailable ? "available" : "unavailable"}`}>
                      {flat.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <div className="flat-row-meta">
                    <span>
                      <strong>Address</strong>
                      {flat.address}
                    </span>
                    <span>
                      <strong>Type</strong>
                      {flat.type}
                    </span>
                    <span>
                      <strong>Price</strong>
                      ৳{flat.price?.toLocaleString?.() ?? flat.price}
                    </span>
                  </div>

                  <div className="row-actions">
                    <button type="button" className="row-button" onClick={() => handleEdit(flat)}>
                      Edit
                    </button>
                    <button type="button" className="row-button danger" onClick={() => handleDelete(flat._id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

export default App;
