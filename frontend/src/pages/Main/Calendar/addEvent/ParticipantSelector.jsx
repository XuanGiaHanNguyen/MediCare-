import { UserCheck } from "lucide-react";

export default function ParticipantSelector({
  formData,
  participantsList,
  loadingParticipants,
  searchTerm,
  setSearchTerm,
  handleParticipantToggle
}) {
  const filteredParticipants = participantsList.filter(participant => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return participant.name?.toLowerCase().includes(searchLower) ||
           participant.email?.toLowerCase().includes(searchLower) ||
           participant.phone?.toLowerCase().includes(searchLower) ||
           participant.role?.toLowerCase().includes(searchLower) ||
           participant.diagnosis?.toLowerCase().includes(searchLower) ||
           participant.language?.toLowerCase().includes(searchLower);
  });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <UserCheck className="w-4 h-4 inline mr-1" />
        Select Attendant(s)
        {formData.type === "appointment" && (
          <span className="text-xs text-gray-500 ml-1">(Select one)</span>
        )}
      </label>
      
      {loadingParticipants ? (
        <div className="border border-gray-300 rounded-lg p-4 text-center text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Loading {formData.type === "meeting" ? "staff" : "patients"}...
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto bg-white">
          {participantsList.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <UserCheck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No {formData.type === "meeting" ? "staff members" : "patients"} found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {/* Search Bar */}
              <div className="p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search attendants..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Participants List */}
              {filteredParticipants.map((participant) => {
                const participantId = participant.id || participant.userId;
                const isSelected = formData.participants.some(p => 
                  (p.id || p.userId) === participantId
                );
                
                return (
                  <ParticipantItem
                    key={participantId}
                    participant={participant}
                    isSelected={isSelected}
                    formData={formData}
                    handleParticipantToggle={handleParticipantToggle}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ParticipantItem({ participant, isSelected, formData, handleParticipantToggle }) {
  const participantId = participant.id || participant.userId;

  return (
    <label
      className={`flex items-center p-4 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-sky-50 border-l-4 border-sky-500' 
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex-shrink-0 mr-4">
        <input
          type={formData.type === "appointment" ? "radio" : "checkbox"}
          name={formData.type === "appointment" ? "selectedPatient" : undefined}
          checked={isSelected}
          onChange={() => handleParticipantToggle(participant)}
          className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${
            formData.type === "appointment" ? "rounded-full" : "rounded"
          }`}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {participant.name}
            </p>
            <p className="text-sm text-gray-600 truncate">
              {participant.email}
            </p>
          </div>
          
          {formData.type === "meeting" ? (
            <div className="flex-shrink-0 ml-4 text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800"> 
                {participant.role}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {participant.language}
              </p>
            </div>
          ) : (
            <div className="flex-shrink-0 ml-4 text-right">
              <p className="text-xs text-gray-500">
                {participant.phone || "Not available"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Diagnosis: {participant.diagnosis}
              </p>
            </div>
          )}
        </div>
      </div>
    </label>
  );
}