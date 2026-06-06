export interface Subject {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface MultiTopicsRequest {
  topicIds: string[];
}
