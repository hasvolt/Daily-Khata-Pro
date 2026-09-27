import React, { useState, useEffect } from 'react';
import { useClient } from 'sanity';
import { INITIAL_CATEGORIES, INITIAL_TOPICS } from './taxonomyData';

export function TaxonomyManagerTool() {
  const client = useClient({ apiVersion: '2024-01-01' });
  const [categoriesCount, setCategoriesCount] = useState<number | null>(null);
  const [topicsCount, setTopicsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [progressText, setProgressText] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const [cats, tops] = await Promise.all([
        client.fetch<number>('count(*[_type == "category"])'),
        client.fetch<number>('count(*[_type == "topic"])'),
      ]);
      setCategoriesCount(cats);
      setTopicsCount(tops);
    } catch (err: any) {
      console.error('Error fetching taxonomy counts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleSeedAll = async () => {
    try {
      setSeeding(true);
      setProgressText('Starting taxonomy provisioning...');
      setLogs([]);

      let catsCreated = 0;
      let topsCreated = 0;

      // 1. Seed Categories
      for (const cat of INITIAL_CATEGORIES) {
        setProgressText(`Checking category: ${cat.name}...`);
        await client.createIfNotExists({
          _id: cat.id,
          _type: 'category',
          name: cat.name,
          slug: { _type: 'slug', current: cat.slug },
          description: cat.description,
          active: true,
        });
        catsCreated++;
      }

      // 2. Seed Topics
      for (const top of INITIAL_TOPICS) {
        setProgressText(`Checking topic: ${top.name}...`);
        await client.createIfNotExists({
          _id: top.id,
          _type: 'topic',
          name: top.name,
          slug: { _type: 'slug', current: top.slug },
          description: top.description,
          active: true,
        });
        topsCreated++;
      }

      setProgressText(`✓ Completed: Verified ${catsCreated} Categories and ${topsCreated} Topics.`);
      setLogs([
        `✓ All ${INITIAL_CATEGORIES.length} categories verified in Sanity.`,
        `✓ All ${INITIAL_TOPICS.length} topics verified in Sanity.`,
        `Existing blog posts and documents remained completely safe and untouched.`,
      ]);
      await fetchCounts();
    } catch (err: any) {
      console.error('Error seeding taxonomy:', err);
      setProgressText(`Error: ${err.message || 'Failed to seed taxonomy. Check permissions.'}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#132438', border: '1px solid #213E61', borderRadius: '16px', padding: '24px', color: '#F8FAFC' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#38BDF8' }}>
              Category & Topic Taxonomy Manager
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94A3B8' }}>
              Manage and seed initial pre-defined Categories and Topics into Sanity Studio.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchCounts}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              background: '#0E1A29',
              border: '1px solid #213E61',
              borderRadius: '8px',
              color: '#CBD5E1',
              cursor: 'pointer',
            }}
          >
            Refresh Counts
          </button>
        </div>

        {/* Status Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '20px 0' }}>
          <div style={{ padding: '16px', background: '#0E1A29', border: '1px solid #213E61', borderRadius: '12px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              Published Categories
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#38BDF8', marginTop: '6px' }}>
              {loading ? '...' : categoriesCount ?? 0}
            </div>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              Standard list: {INITIAL_CATEGORIES.length}
            </span>
          </div>

          <div style={{ padding: '16px', background: '#0E1A29', border: '1px solid #213E61', borderRadius: '12px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              Published Topics
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#34D399', marginTop: '6px' }}>
              {loading ? '...' : topicsCount ?? 0}
            </div>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              Standard list: {INITIAL_TOPICS.length}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            type="button"
            onClick={handleSeedAll}
            disabled={seeding}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 700,
              background: seeding ? '#475569' : '#0284C7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              cursor: seeding ? 'wait' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s',
            }}
          >
            {seeding ? '⚡ Seeding Taxonomy in Sanity...' : '⚡ Seed / Verify Initial Categories & Topics (Safe & Idempotent)'}
          </button>

          {progressText && (
            <div style={{ fontSize: '13px', color: '#38BDF8', fontWeight: 600, padding: '8px 12px', background: '#0E1A29', borderRadius: '8px', border: '1px solid #213E61' }}>
              {progressText}
            </div>
          )}

          {logs.length > 0 && (
            <div style={{ marginTop: '8px', padding: '12px', background: '#052e16', border: '1px solid #166534', borderRadius: '8px', color: '#86efac', fontSize: '12px', lineHeight: '1.6' }}>
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </div>

        {/* Data Safety Note */}
        <div style={{ marginTop: '24px', padding: '12px 16px', background: '#070E18', border: '1px solid #213E61', borderRadius: '10px', fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
          <strong style={{ color: '#E2E8F0' }}>Data Safety Guarantee:</strong> Seeding uses idempotent <code style={{ color: '#38BDF8' }}>createIfNotExists</code>. It will never delete, duplicate, or overwrite existing blog posts, authors, or existing taxonomy documents.
        </div>
      </div>
    </div>
  );
}
