import React from "react";
// React Icons
import { AiOutlineExclamationCircle, AiOutlineClose } from "react-icons/ai";

function ErrorMessage({ error, onDismiss }) {
  if (!error) return null;
  
  return (
    <div className="w-full animate-fade-in">
      <div className="bg-gradient-to-r from-red-50 to-red-50/80 border border-red-200 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="p-1 bg-red-100 rounded-xl">
              <AiOutlineExclamationCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-red-800 font-medium text-sm leading-relaxed" style={{color: '#991b1b !important'}}>
              {error}
            </p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-1 hover:bg-red-100 rounded-xl transition-colors duration-200 group"
            >
              <AiOutlineClose className="w-4 h-4 text-red-500 group-hover:text-red-700 transition-colors duration-200" />
            </button>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ErrorMessage;
