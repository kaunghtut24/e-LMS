import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { LOCAL_AUTH_ENABLED, getMockUser } from '../config/localAuth';
import type {
  Assessment,
  AssessmentAttempt,
  AssessmentQuestion,
  AssessmentResponse,
  Rubric,
  AssessmentAnalytics,
  CreateAssessmentDTO,
  CreateQuestionDTO,
  SubmitAttemptDTO,
  CreateRubricDTO,
} from '../types/phase3-assessment';

interface AssessmentState {
  // State
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  questions: AssessmentQuestion[];
  attempts: AssessmentAttempt[];
  currentAttempt: AssessmentAttempt | null;
  rubrics: Rubric[];
  analytics: AssessmentAnalytics | null;
  isLoading: boolean;
  error: string | null;

  // Assessment actions
  fetchAssessments: (courseId?: string) => Promise<void>;
  fetchAssessment: (id: string) => Promise<void>;
  createAssessment: (data: CreateAssessmentDTO) => Promise<Assessment | null>;
  updateAssessment: (id: string, data: Partial<Assessment>) => Promise<boolean>;
  deleteAssessment: (id: string) => Promise<boolean>;
  publishAssessment: (id: string) => Promise<boolean>;

  // Question actions
  fetchQuestions: (assessmentId: string) => Promise<void>;
  createQuestion: (data: CreateQuestionDTO) => Promise<AssessmentQuestion | null>;
  updateQuestion: (id: string, data: Partial<AssessmentQuestion>) => Promise<boolean>;
  deleteQuestion: (id: string) => Promise<boolean>;
  reorderQuestions: (assessmentId: string, questionIds: string[]) => Promise<boolean>;

  // Attempt actions
  fetchAttempts: (assessmentId: string) => Promise<void>;
  fetchUserAttempts: (userId: string, assessmentId?: string) => Promise<void>;
  startAttempt: (assessmentId: string) => Promise<AssessmentAttempt | null>;
  submitAttempt: (attemptId: string, data: SubmitAttemptDTO) => Promise<boolean>;
  gradeAttempt: (attemptId: string, responses: AssessmentResponse[]) => Promise<boolean>;

  // Response actions
  saveResponse: (attemptId: string, questionId: string, answer: any) => Promise<boolean>;
  fetchResponses: (attemptId: string) => Promise<AssessmentResponse[]>;

  // Rubric actions
  fetchRubrics: (assessmentId?: string) => Promise<void>;
  createRubric: (data: CreateRubricDTO) => Promise<Rubric | null>;
  updateRubric: (id: string, data: Partial<Rubric>) => Promise<boolean>;
  deleteRubric: (id: string) => Promise<boolean>;

  // Analytics actions
  fetchAnalytics: (assessmentId: string) => Promise<void>;

  // Utility actions
  clearError: () => void;
  setCurrentAssessment: (assessment: Assessment | null) => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      // Initial state
      assessments: [],
      currentAssessment: null,
      questions: [],
      attempts: [],
      currentAttempt: null,
      rubrics: [],
      analytics: null,
      isLoading: false,
      error: null,

      // ============================================
      // Assessment Actions
      // ============================================

      fetchAssessments: async (courseId?: string) => {
        set({ isLoading: true, error: null });

        try {
          let query = supabase
            .from('assessments')
            .select(`
              *,
              course:course_id(id, title),
              creator:created_by(id, first_name, last_name)
            `)
            .order('created_at', { ascending: false });

          if (courseId) {
            query = query.eq('course_id', courseId);
          }

          const { data, error } = await query;

          if (error) throw error;

          set({ assessments: data || [], isLoading: false });
        } catch (error: any) {
          console.error('Error fetching assessments:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      fetchAssessment: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase
            .from('assessments')
            .select(`
              *,
              course:course_id(id, title),
              creator:created_by(id, first_name, last_name)
            `)
            .eq('id', id)
            .single();

          if (error) throw error;

          set({ currentAssessment: data, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching assessment:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      createAssessment: async (data: CreateAssessmentDTO): Promise<Assessment | null> => {
        set({ isLoading: true, error: null });

        try {
          const { data: profile } = await supabase.auth.getUser();
          if (!profile.user) throw new Error('Not authenticated');

          const { data: assessment, error } = await supabase
            .from('assessments')
            .insert({
              ...data,
              created_by: profile.user.id,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            assessments: [assessment, ...state.assessments],
            isLoading: false,
          }));

          return assessment;
        } catch (error: any) {
          console.error('Error creating assessment:', error);
          set({ error: error.message, isLoading: false });
          return null;
        }
      },

      updateAssessment: async (id: string, data: Partial<Assessment>): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { data: updated, error } = await supabase
            .from('assessments')
            .update(data)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            assessments: state.assessments.map((a) => (a.id === id ? updated : a)),
            currentAssessment: state.currentAssessment?.id === id ? updated : state.currentAssessment,
            isLoading: false,
          }));

          return true;
        } catch (error: any) {
          console.error('Error updating assessment:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      deleteAssessment: async (id: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { error } = await supabase
            .from('assessments')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            assessments: state.assessments.filter((a) => a.id !== id),
            currentAssessment: state.currentAssessment?.id === id ? null : state.currentAssessment,
            isLoading: false,
          }));

          return true;
        } catch (error: any) {
          console.error('Error deleting assessment:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      publishAssessment: async (id: string): Promise<boolean> => {
        return get().updateAssessment(id, { is_published: true });
      },

      // ============================================
      // Question Actions
      // ============================================

      fetchQuestions: async (assessmentId: string) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase
            .from('assessment_questions')
            .select('*')
            .eq('assessment_id', assessmentId)
            .order('order_index');

          if (error) throw error;

          set({ questions: data || [], isLoading: false });
        } catch (error: any) {
          console.error('Error fetching questions:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      createQuestion: async (data: CreateQuestionDTO): Promise<AssessmentQuestion | null> => {
        set({ isLoading: true, error: null });

        try {
          // Get the next order index
          const { data: maxOrder } = await supabase
            .from('assessment_questions')
            .select('order_index')
            .eq('assessment_id', data.assessment_id)
            .order('order_index', { ascending: false })
            .limit(1)
            .single();

          const order_index = (maxOrder?.order_index || 0) + 1;

          const { data: question, error } = await supabase
            .from('assessment_questions')
            .insert({
              ...data,
              order_index,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            questions: [...state.questions, question],
            isLoading: false,
          }));

          return question;
        } catch (error: any) {
          console.error('Error creating question:', error);
          set({ error: error.message, isLoading: false });
          return null;
        }
      },

      updateQuestion: async (id: string, data: Partial<AssessmentQuestion>): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { data: updated, error } = await supabase
            .from('assessment_questions')
            .update(data)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            questions: state.questions.map((q) => (q.id === id ? updated : q)),
            isLoading: false,
          }));

          return true;
        } catch (error: any) {
          console.error('Error updating question:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      deleteQuestion: async (id: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { error } = await supabase
            .from('assessment_questions')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            questions: state.questions.filter((q) => q.id !== id),
            isLoading: false,
          }));

          return true;
        } catch (error: any) {
          console.error('Error deleting question:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      reorderQuestions: async (assessmentId: string, questionIds: string[]): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // Update order_index for each question
          for (let i = 0; i < questionIds.length; i++) {
            await supabase
              .from('assessment_questions')
              .update({ order_index: i })
              .eq('id', questionIds[i]);
          }

          // Refresh questions
          await get().fetchQuestions(assessmentId);
          set({ isLoading: false });
          return true;
        } catch (error: any) {
          console.error('Error reordering questions:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      // ============================================
      // Attempt Actions
      // ============================================

      fetchAttempts: async (assessmentId: string) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase
            .from('assessment_attempts')
            .select(`
              *,
              user:user_id(id, first_name, last_name, email)
            `)
            .eq('assessment_id', assessmentId)
            .order('started_at', { ascending: false });

          if (error) throw error;

          set({ attempts: data || [], isLoading: false });
        } catch (error: any) {
          console.error('Error fetching attempts:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      fetchUserAttempts: async (userId: string, assessmentId?: string) => {
        set({ isLoading: true, error: null });

        try {
          let query = supabase
            .from('assessment_attempts')
            .select(`
              *,
              assessment:assessment_id(id, title, type, total_points)
            `)
            .eq('user_id', userId)
            .order('started_at', { ascending: false });

          if (assessmentId) {
            query = query.eq('assessment_id', assessmentId);
          }

          const { data, error } = await query;

          if (error) throw error;

          set({ attempts: data || [], isLoading: false });
        } catch (error: any) {
          console.error('Error fetching user attempts:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      startAttempt: async (assessmentId: string): Promise<AssessmentAttempt | null> => {
        set({ isLoading: true, error: null });

        try {
          const { data: profile } = await supabase.auth.getUser();
          if (!profile.user) throw new Error('Not authenticated');

          // Get attempt count for this user
          const { count } = await supabase
            .from('assessment_attempts')
            .select('*', { count: 'exact', head: true })
            .eq('assessment_id', assessmentId)
            .eq('user_id', profile.user.id);

          const attempt_number = (count || 0) + 1;

          const { data: attempt, error } = await supabase
            .from('assessment_attempts')
            .insert({
              assessment_id: assessmentId,
              user_id: profile.user.id,
              attempt_number,
              status: 'in_progress',
            })
            .select()
            .single();

          if (error) throw error;

          set({ currentAttempt: attempt, isLoading: false });
          return attempt;
        } catch (error: any) {
          console.error('Error starting attempt:', error);
          set({ error: error.message, isLoading: false });
          return null;
        }
      },

      submitAttempt: async (attemptId: string, data: SubmitAttemptDTO): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { data: attempt, error: attemptError } = await supabase
            .from('assessment_attempts')
            .select('*, assessment:assessment_id(*)')
            .eq('id', attemptId)
            .single();

          if (attemptError) throw attemptError;

          // Auto-grade multiple choice and true/false
          const { data: questions } = await supabase
            .from('assessment_questions')
            .select('*')
            .eq('assessment_id', attempt.assessment_id);

          const responses = data.responses.map((response) => {
            const question = questions?.find((q) => q.id === response.question_id);
            let is_correct = false;
            let points_earned = 0;

            if (question) {
              if (question.question_type === 'multiple_choice') {
                const correctOption = question.question_data.options?.find(
                  (opt: any) => opt.is_correct
                );
                is_correct = correctOption?.id === response.answer_data?.option_id;
                points_earned = is_correct ? question.points : 0;
              } else if (question.question_type === 'true_false') {
                is_correct = question.question_data.correct_answer === response.answer_data?.value;
                points_earned = is_correct ? question.points : 0;
              }
            }

            return {
              attempt_id: attemptId,
              question_id: response.question_id,
              answer_text: response.answer_text,
              answer_data: response.answer_data,
              is_correct,
              points_earned,
              auto_graded: question?.question_type !== 'essay' && question?.question_type !== 'code',
            };
          });

          // Insert all responses
          const { error: responseError } = await supabase
            .from('assessment_responses')
            .insert(responses);

          if (responseError) throw responseError;

          // Calculate score
          const totalEarned = responses.reduce((sum, r) => sum + r.points_earned, 0);
          const totalPossible = attempt.assessment?.total_points || 0;
          const percentage = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;
          const passed = attempt.assessment?.passing_score
            ? percentage >= attempt.assessment.passing_score
            : true;

          // Update attempt
          const { error: updateError } = await supabase
            .from('assessment_attempts')
            .update({
              status: 'submitted',
              submitted_at: new Date().toISOString(),
              score: totalEarned,
              total_possible: totalPossible,
              percentage,
              passed,
            })
            .eq('id', attemptId);

          if (updateError) throw updateError;

          set({ isLoading: false });
          return true;
        } catch (error: any) {
          console.error('Error submitting attempt:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      gradeAttempt: async (attemptId: string, responses: AssessmentResponse[]): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const totalEarned = responses.reduce((sum, r) => sum + r.points_earned, 0);
          const totalPossible = responses.reduce((sum, r) => sum + (r.question?.points || 0), 0);
          const percentage = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;

          // Update responses
          for (const response of responses) {
            await supabase
              .from('assessment_responses')
              .update({
                points_earned: response.points_earned,
                feedback: response.feedback,
                graded_at: new Date().toISOString(),
              })
              .eq('id', response.id);
          }

          // Update attempt
          await supabase
            .from('assessment_attempts')
            .update({
              status: 'graded',
              score: totalEarned,
              total_possible: totalPossible,
              percentage,
              graded_at: new Date().toISOString(),
            })
            .eq('id', attemptId);

          set({ isLoading: false });
          return true;
        } catch (error: any) {
          console.error('Error grading attempt:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      // ============================================
      // Response Actions
      // ============================================

      saveResponse: async (attemptId: string, questionId: string, answer: any): Promise<boolean> => {
        try {
          const { error } = await supabase
            .from('assessment_responses')
            .upsert({
              attempt_id: attemptId,
              question_id: questionId,
              answer_text: answer.answer_text,
              answer_data: answer.answer_data,
            });

          if (error) throw error;
          return true;
        } catch (error: any) {
          console.error('Error saving response:', error);
          return false;
        }
      },

      fetchResponses: async (attemptId: string): Promise<AssessmentResponse[]> => {
        try {
          const { data, error } = await supabase
            .from('assessment_responses')
            .select(`
              *,
              question:question_id(id, question_text, points, question_type)
            `)
            .eq('attempt_id', attemptId);

          if (error) throw error;

          set({ isLoading: false });
          return data || [];
        } catch (error: any) {
          console.error('Error fetching responses:', error);
          set({ error: error.message, isLoading: false });
          return [];
        }
      },

      // ============================================
      // Rubric Actions
      // ============================================

      fetchRubrics: async (assessmentId?: string) => {
        set({ isLoading: true, error: null });

        try {
          let query = supabase
            .from('rubrics')
            .select(`
              *,
              creator:created_by(id, first_name, last_name)
            `)
            .order('created_at', { ascending: false });

          if (assessmentId) {
            query = query.eq('assessment_id', assessmentId);
          }

          const { data, error } = await query;

          if (error) throw error;

          set({ rubrics: data || [], isLoading: false });
        } catch (error: any) {
          console.error('Error fetching rubrics:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      createRubric: async (data: CreateRubricDTO): Promise<Rubric | null> => {
        set({ isLoading: true, error: null });

        try {
          const { data: profile } = await supabase.auth.getUser();
          if (!profile.user) throw new Error('Not authenticated');

          const { data: rubric, error } = await supabase
            .from('rubrics')
            .insert({
              ...data,
              created_by: profile.user.id,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            rubrics: [rubric, ...state.rubrics],
            isLoading: false,
          }));

          return rubric;
        } catch (error: any) {
          console.error('Error creating rubric:', error);
          set({ error: error.message, isLoading: false });
          return null;
        }
      },

      updateRubric: async (id: string, data: Partial<Rubric>): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { data: updated, error } = await supabase
            .from('rubrics')
            .update(data)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            rubrics: state.rubrics.map((r) => (r.id === id ? updated : r)),
            isLoading: false,
          }));

          return true;
        } catch (error: any) {
          console.error('Error updating rubric:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      deleteRubric: async (id: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const { error } = await supabase
            .from('rubrics')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            rubrics: state.rubrics.filter((r) => r.id !== id),
            isLoading: false,
          }));

          return true;
        } catch (error: any) {
          console.error('Error deleting rubric:', error);
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      // ============================================
      // Analytics Actions
      // ============================================

      fetchAnalytics: async (assessmentId: string) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase
            .from('assessment_analytics')
            .select('*')
            .eq('assessment_id', assessmentId)
            .single();

          if (error && error.code !== 'PGRST116') throw error;

          set({ analytics: data, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching analytics:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      // ============================================
      // Utility Actions
      // ============================================

      clearError: () => {
        set({ error: null });
      },

      setCurrentAssessment: (assessment: Assessment | null) => {
        set({ currentAssessment: assessment });
      },
    }),
    {
      name: 'assessment-storage',
      partialize: (state) => ({
        // Only persist assessments list
        assessments: state.assessments,
      }),
    }
  )
);
