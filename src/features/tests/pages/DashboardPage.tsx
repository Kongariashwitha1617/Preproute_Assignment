import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ClipboardList, EyeOff, FileCheck, FilePen, Radio } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageLoader } from '@/components/ui/Loader';
import { StatusBadge } from '@/components/ui/Badge';
import { getErrorMessage } from '@/lib/api/client';
import { formatDate } from '@/lib/utils/format';
import { useTests } from '@/hooks/useTests';

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof ClipboardList;
  accent: string;
}) {
  return (
    <div className="figma-card flex items-center gap-4 !p-5">
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: tests, isLoading, isError, error, refetch } = useTests();

  const stats = useMemo(() => {
    const list = tests ?? [];
    const draft = list.filter((t) => t.status === 'draft').length;
    const live = list.filter((t) => t.status === 'live').length;
    const scheduled = list.filter((t) => t.status === 'scheduled').length;
    const unpublished = list.filter((t) => t.status === 'unpublished').length;
    const total = list.length;
    const tracked = draft + live + scheduled + unpublished;
    const other = total - tracked;

    return { total, draft, live, scheduled, unpublished, other };
  }, [tests]);

  const recentTests = useMemo(() => {
    if (!tests) return [];
    return [...tests]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [tests]);

  if (isLoading) return <PageLoader />;
  if (isError) {
    return (
      <div className="p-8">
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
      </div>
    );
  }

  return (
    <main className="figma-page">
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="figma-heading text-xl">Dashboard</h1>
          <p className="figma-subtext mt-1">Overview of your test management activity</p>
        </div>
        <Button onClick={() => navigate('/tests/create')}>Create New Test</Button>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Total Tests"
          value={stats.total}
          icon={ClipboardList}
          accent="bg-primary-50 text-primary"
        />
        <StatCard
          label="Draft Tests"
          value={stats.draft}
          icon={FilePen}
          accent="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Scheduled Tests"
          value={stats.scheduled}
          icon={Radio}
          accent="bg-violet-50 text-violet-600"
        />
        <StatCard
          label="Live Tests"
          value={stats.live}
          icon={FileCheck}
          accent="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Unpublished Tests"
          value={stats.unpublished}
          icon={EyeOff}
          accent="bg-red-50 text-red-600"
        />
      </div>

      <p className="mb-8 rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-slate-600">
        <span className="font-medium text-slate-800">Note: </span>
        Total Tests includes every test returned from the API on this shared staging platform.
        The status cards above show Draft, Scheduled, Live, and Unpublished counts.
        {stats.other > 0 && (
          <>
            {' '}
            {stats.other} additional test{stats.other === 1 ? '' : 's'} use other statuses
            (for example Expired or unknown) and are included in the total.
          </>
        )}
      </p>

      <div className="figma-card">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Recent Tests</h2>
            <p className="text-sm text-slate-500">Latest tests created on the platform</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            onClick={() => navigate('/test-tracking')}
          >
            View All Tests
          </Button>
        </div>

        {recentTests.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No tests yet. Create your first test to get started.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTests.map((test) => (
              <div
                key={test.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">{test.name}</p>
                  <p className="text-sm text-slate-500">
                    {test.subject} · Created {formatDate(test.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={test.status} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/tests/${test.id}/preview`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
