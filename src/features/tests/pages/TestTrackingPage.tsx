import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { TableSkeleton } from '@/components/ui/Loader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table';
import { TEST_STATUSES } from '@/lib/constants';
import { formatDate } from '@/lib/utils/format';
import { getErrorMessage } from '@/lib/api/client';
import { useDeleteTest, useTests } from '@/hooks/useTests';
import { DeleteTestDialog } from '../components/DeleteTestDialog';
import type { Test } from '@/types/test';

export function TestTrackingPage() {
  const navigate = useNavigate();
  const { data: tests, isLoading, isError, error, refetch } = useTests();
  const deleteMutation = useDeleteTest();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Test | null>(null);

  const filteredTests = useMemo(() => {
    if (!tests) return [];

    return tests.filter((test) => {
      const matchesSearch =
        search === '' ||
        test.name.toLowerCase().includes(search.toLowerCase()) ||
        test.subject.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === '' || test.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tests, search, statusFilter]);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <>
      <main className="figma-page">
        <Breadcrumbs items={[{ label: 'Test Tracking' }]} />
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="figma-heading text-xl">Test Tracking</h1>
            <p className="figma-subtext mt-1">Manage and monitor all your tests</p>
          </div>
          <Button onClick={() => navigate('/tests/create')}>Create New Test</Button>
        </div>

        <div>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by test name or subject..."
              className="sm:max-w-xs"
            />
            <Select
              options={[
                { value: '', label: 'All Statuses' },
                ...TEST_STATUSES.map((s) => ({ value: s.value, label: s.label })),
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="sm:max-w-[180px]"
            />
          </div>

          {isLoading && <TableSkeleton rows={6} />}

          {isError && (
            <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
          )}

          {!isLoading && !isError && filteredTests.length === 0 && (
            <EmptyState
              title="No tests found"
              description={
                search || statusFilter
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first test.'
              }
              actionLabel={!search && !statusFilter ? 'Create New Test' : undefined}
              onAction={
                !search && !statusFilter ? () => navigate('/tests/create') : undefined
              }
            />
          )}

          {!isLoading && !isError && filteredTests.length > 0 && (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Test Name</TableHeaderCell>
                      <TableHeaderCell>Subject</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Created</TableHeaderCell>
                      <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium text-[#1E293B]">
                          {test.name}
                        </TableCell>
                        <TableCell>{test.subject}</TableCell>
                        <TableCell>
                          <StatusBadge status={test.status} />
                        </TableCell>
                        <TableCell>{formatDate(test.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/tests/${test.id}/preview`)}
                              title="View test"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/tests/${test.id}/edit`)}
                              title="Edit test"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(test)}
                              title="Delete test"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4 md:hidden">
                {filteredTests.map((test) => (
                  <div
                    key={test.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{test.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{test.subject}</p>
                      </div>
                      <StatusBadge status={test.status} />
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                      Created {formatDate(test.created_at)}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/tests/${test.id}/preview`)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/tests/${test.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(test)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!isLoading && !isError && filteredTests.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>
                Showing {filteredTests.length} of {tests?.length ?? 0} tests
              </span>
              {statusFilter && (
                <Badge variant="info">
                  Filtered by: {TEST_STATUSES.find((s) => s.value === statusFilter)?.label}
                </Badge>
              )}
            </div>
          )}
        </div>
      </main>

      <DeleteTestDialog
        isOpen={Boolean(deleteTarget)}
        testName={deleteTarget?.name ?? ''}
        isLoading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
