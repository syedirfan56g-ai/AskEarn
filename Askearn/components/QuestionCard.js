'use client';

import Link from 'next/link';
import { MessageSquare, User, Clock } from 'lucide-react';

export default function QuestionCard({ question }) {
  const timeAgo = getTimeAgo(new Date(question.created_at));

  return (
    <Link href={`/question/${question.id}`}>
      <div className="card hover:shadow-md transition-shadow cursor-pointer">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{question.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{question.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{question.author_name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{timeAgo}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-primary font-semibold">
            <MessageSquare className="w-4 h-4" />
            <span>{question.answer_count || 0} answers</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
