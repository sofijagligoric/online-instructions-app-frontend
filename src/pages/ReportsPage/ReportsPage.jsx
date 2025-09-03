import React, { useState, useEffect } from "react";
import reportService from "../../services/report.service";
import "./ReportsPage.css";
import "../../App.css";
import violationTypeService from "../../services/violationType.service";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";

import { Select, Popconfirm } from "antd";
import advertsService from "../../services/adverts.service";
import threadService from "../../services/thread.service";
import commentService from "../../services/comment.service";
import resourceService from "../../services/resource.service";
const { Option } = Select;

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [violationTypes, setViolationTypes] = useState([]);
  const [filters, setFilters] = useState({
    violationTypeId: "",
    contentType: "",
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  useEffect(() => {
    const fetchViolationTypes = async () => {
      try {
        const response = await violationTypeService.getAllViolationTypes();
        setViolationTypes(response.data);
      } catch (err) {
        console.error("Failed to load violation types:", err);
      }
    };

    fetchViolationTypes();
  }, []);

  useEffect(() => {
    const fetchAllReports = async () => {
      const [threadReports, advertReports, commentReports, resourceReports] =
        await Promise.all([
          reportService.getAllThreadReportsWithDetails(),
          reportService.getAllAdvertReportsWithDetails(),
          reportService.getAllCommentReportsWithDetails(),
          reportService.getAllResourceReportsWithDetails(),
        ]);

      setReports([
        ...threadReports,
        ...advertReports,
        ...commentReports,
        ...resourceReports,
      ]);
    };

    fetchAllReports();
  }, []);

  const filteredReports = reports.filter(
    (r) =>
      (!filters.violationTypeId ||
        r.violationTypeId === +filters.violationTypeId) &&
      (!filters.contentType || r.contentType === filters.contentType)
  );
  const viewContent = async (report) => {
    let data;
    switch (report.contentType) {
      case "advert":
        data = await reportService.getReportsForAdvert(report.contentId);
        break;
      case "comment":
        data = await reportService.getReportsForComment(report.contentId);
        break;
      case "resource":
        data = await reportService.getReportsForResource(report.contentId);
        break;
      case "thread":
        data = await reportService.getReportsForThread(report.contentId);
        break;
      default:
        data = null;
    }
    setSelectedReport(report);
    setSelectedContent(data);
  };

  const deleteContent = async (report) => {
    try {
      switch (report.contentType) {
        case "advert":
          try {
            await advertsService.deleteAdvert(report.contentId);
          } catch (err) {
            console.error("Error deleting advert:", err);
          }
          break;
        case "thread":
          try {
            await threadService.deleteDiscussionThread(report.contentId);
          } catch (err) {
            console.error("Error deleting thread:", err);
          }
          break;
        case "comment":
          try {
            await commentService.deleteComment(report.contentId);
          } catch (err) {
            console.error("Error deleting comment:", err);
          }
          break;
        case "resource":
          try {
            await resourceService.deleteResource(report.contentId);
          } catch (err) {
            console.error("Error deleting resource:", err);
          }
          break;
        default:
          alert("Unknown post.");
      }
      alert("Content deleted successfully");
      setReports(reports.filter((r) => r.id !== report.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete content");
    }
  };

  const deleteReport = async (report) => {
    try {
      switch (report.contentType) {
        case "advert":
          try {
            await reportService.deleteAdvertReport(report.id);
            await reportService.deleteReport(report.id);
          } catch (err) {
            console.error("Error deleting advert:", err);
          }
          break;
        case "thread":
          try {
            await reportService.deleteThreadReport(report.id);
            await reportService.deleteReport(report.id);
          } catch (err) {
            console.error("Error deleting advert:", err);
          }
          break;
        case "comment":
          try {
            await reportService.deleteCommentReport(report.id);
            await reportService.deleteReport(report.id);
          } catch (err) {
            console.error("Error deleting advert:", err);
          }
          break;
        case "resource":
          try {
            await reportService.deleteResourceReport(report.id);
            await reportService.deleteReport(report.id);
          } catch (err) {
            console.error("Error deleting advert:", err);
          }
          break;
        default:
          alert("Unknown post.");
      }
      alert("Report deleted successfully");
      setReports(reports.filter((r) => r.id !== report.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete report");
    }
  };

  return (
    <div className="reports-page">
      <h2>Reports</h2>

      <div className="filters">
        <Select
          value={filters.violationTypeId}
          onChange={(value) =>
            setFilters({ ...filters, violationTypeId: value })
          }
          placeholder="All types"
          className="custom-sort-select"
          allowClear
        >
          <Option value="">All types</Option> {/* ovo je default */}
          {violationTypes.map((v) => (
            <Option key={v.id} value={v.id}>
              {v.name}
            </Option>
          ))}
        </Select>

        <Select
          value={filters.contentType}
          onChange={(value) => setFilters({ ...filters, contentType: value })}
          placeholder="All"
          className="custom-sort-select"
          allowClear
        >
          <Option value="">All</Option> {/* default */}
          <Option value="advert">Advert</Option>
          <Option value="comment">Comment</Option>
          <Option value="resource">Resource</Option>
          <Option value="thread">Thread</Option>
        </Select>
      </div>

      <table className="reports-table">
        <thead>
          <tr>
            <th>Violation Type</th>
            <th>Description</th>
            <th>Timestamp</th>
            <th>Content Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((r) => (
            <tr key={`${r.contentType}-${r.id}`}>
              <td>
                {violationTypes.find((v) => v.id === r.violationTypeId)?.name}
              </td>
              <td>{r.description}</td>
              <td>{new Date(r.timestamp).toLocaleString()}</td>
              <td>{r.contentType}</td>
              <td>
                <button
                  className="action-button-reports"
                  onClick={() => viewContent(r)}
                  title="View details"
                >
                  <EyeOutlined style={{ color: "#020f3d" }} />
                </button>

                <Popconfirm
                  title="Are you sure you want to delete this content?"
                  onConfirm={() => deleteContent(r)}
                  okText="Yes"
                  cancelText="No"
                >
                  <button
                    className="action-button-reports"
                    title="Delete content"
                  >
                    <DeleteOutlined style={{ color: "orange" }} />
                  </button>
                </Popconfirm>

                <Popconfirm
                  title="Are you sure you want to delete this report?"
                  onConfirm={() => deleteReport(r)}
                  okText="Yes"
                  cancelText="No"
                >
                  <button
                    className="action-button-reports"
                    title="Delete report"
                  >
                    <DeleteOutlined style={{ color: "red" }} />
                  </button>
                </Popconfirm>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedReport && selectedContent && (
        <div className="modal">
          <div className="modal-content">
            <h3>Details</h3>
            <p>
              <strong>Type:</strong> {selectedReport.contentType}
            </p>

            <pre>{JSON.stringify(selectedContent, null, 2)}</pre>
            <button
              onClick={() => {
                setSelectedReport(null);
                setSelectedContent(null);
              }}
            >
              Zatvori
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
