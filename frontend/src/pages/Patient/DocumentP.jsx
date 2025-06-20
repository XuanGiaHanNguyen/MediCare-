import { useState } from "react";
import {
  Calendar,
  Plus,
  Users,
  FileText,
  Home,
  Bed,
  Upload,
  Search,
  Grid,
  List,
  Folder,
  File,
  Download,
  Share,
  MoreVertical,
  Star,
  Eye
} from "lucide-react";
import DockHeader from "../../component/DockHeader"
import { useNavigate } from "react-router-dom";

export default function DocumentPDock() {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const Id = localStorage.getItem("Id")

  const navigate = useNavigate()

  // Sample data
  const folders = [
    { id: 1, name: 'Financial Records', itemCount: 15, color: 'bg-sky-100 text-sky-600' },
    { id: 2, name: 'Medical Records', itemCount: 6, color: 'bg-sky-100 text-sky-600' },
    { id: 3, name: 'Legal Documents', itemCount: 4, color: 'bg-sky-100 text-sky-600' },
    { id: 4, name: 'References', itemCount: 20, color: 'bg-sky-100 text-sky-600' }
  ];

  const documents = [
    { id: 1, name: 'Contract_2024.pdf', type: 'PDF', size: '2.4 MB', modified: '2 hours ago', starred: true },
    { id: 2, name: 'Project_Report.docx', type: 'Word', size: '1.8 MB', modified: '1 day ago', starred: false },
    { id: 3, name: 'Presentation_Draft.pptx', type: 'PowerPoint', size: '5.2 MB', modified: '3 days ago', starred: true },
    { id: 4, name: 'Budget_Analysis.xlsx', type: 'Excel', size: '890 KB', modified: '1 week ago', starred: false },
    { id: 5, name: 'Meeting_Notes.txt', type: 'Text', size: '45 KB', modified: '2 weeks ago', starred: false },
    { id: 6, name: 'Design_Mockup.png', type: 'Image', size: '3.1 MB', modified: '1 month ago', starred: true }
  ];

  const getFileIcon = (type) => {
    const iconClass = "w-8 h-8";
    switch(type) {
      case 'PDF': return <File className={`${iconClass} text-sky-700`} />;
      case 'Word': return <File className={`${iconClass} text-sky-700`} />;
      case 'Excel': return <File className={`${iconClass} text-sky-700`} />;
      case 'PowerPoint': return <File className={`${iconClass} text-sky-700`} />;
      case 'Image': return <File className={`${iconClass} text-sky-700`} />;
      default: return <File className={`${iconClass} text-sky-700`} />;
    }
  };

  return (
    <div>
      <DockHeader />
      <div className="w-full min-h-screen bg-gray-50 flex flex-row">
        {/* Sidebar */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center gap-4 py-6">
          <button onClick={(e)=>navigate(`/dock/patient/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/calendar/patient/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/docs/patient/${Id}`)} className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-colors">
            <Bed className="w-5 h-5" />
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentations</h1>
              <p className="text-gray-600">Storage of all your important documentations</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                <Upload className="w-5 h-5" />
                Upload
              </button>
              <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="size">Sort by Size</option>
              <option value="type">Sort by Type</option>
            </select>
            <div className="flex bg-white border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-sky-50 text-sky-600' : 'text-gray-400 hover:bg-gray-50'} transition-colors`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-sky-50 text-sky-600' : 'text-gray-400 hover:bg-gray-50'} transition-colors`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Folders Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Folders</h2>
            <div className="grid grid-cols-6 gap-4">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <div className={`w-12 h-12 ${folder.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <Folder className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{folder.name}</h3>
                  <p className="text-xs text-gray-500">{folder.itemCount} items</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Documents</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-6 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-center justify-between mb-3">
                      {getFileIcon(doc.type)}
                      <div className="flex gap-1">
                        {doc.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{doc.name}</h3>
                    <p className="text-xs text-gray-500 mb-1">{doc.size}</p>
                    <p className="text-xs text-gray-400">{doc.modified}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 text-sm font-medium text-gray-700">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-2">Modified</div>
                  <div className="col-span-1">Actions</div>
                </div>
                {documents.map((doc) => (
                  <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer group">
                    <div className="col-span-5 flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <span className="font-medium text-gray-900 truncate">{doc.name}</span>
                      {doc.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    </div>
                    <div className="col-span-2 flex items-center text-gray-600">{doc.type}</div>
                    <div className="col-span-2 flex items-center text-gray-600">{doc.size}</div>
                    <div className="col-span-2 flex items-center text-gray-600">{doc.modified}</div>
                    <div className="col-span-1 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Share className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}