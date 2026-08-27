-- Sample Activities for Hanoi
-- Run this in Supabase SQL Editor after migrations

-- Activity 1: Coffee Walk in Old Quarter
INSERT INTO activities (
  slug,
  title_vi,
  description_vi,
  category,
  pillar,
  relationship_type,
  effort_level,
  time_required_minutes,
  location_type,
  city,
  cost_range,
  steps,
  conversation_prompts,
  tips,
  tags,
  is_active
) VALUES (
  'coffee-walk-old-quarter-hanoi',
  'Dạo phố cổ Hà Nội và uống cà phê',
  'Khám phá phố cổ Hà Nội cùng nhau, dừng chân uống cà phê vỉa hè và trò chuyện',
  'date',
  ARRAY['connection', 'novelty'],
  ARRAY['new', 'long_term'],
  'low',
  90,
  'outdoor',
  ARRAY['hanoi'],
  'budget',
  '[
    {"order": 1, "instruction_vi": "Gặp nhau tại ngã tư Hàng Đào - Hàng Ngang lúc chiều tà"},
    {"order": 2, "instruction_vi": "Dạo bộ qua các con phố nhỏ: Hàng Gai, Hàng Bạc, Mã Mây"},
    {"order": 3, "instruction_vi": "Dừng chân tại quán cà phê vỉa hè, gọi 2 ly cà phê sữa đá"},
    {"order": 4, "instruction_vi": "Ngồi trò chuyện 30-40 phút, quan sát dòng người qua lại"},
    {"order": 5, "instruction_vi": "Tiếp tục dạo về phía Hồ Hoàn Kiếm nếu muốn"}
  ]'::jsonb,
  '[
    {"prompt_vi": "Nếu có thể sống ở bất kỳ thành phố nào trên thế giới, bạn chọn đâu và tại sao?"},
    {"prompt_vi": "Kỷ niệm nào về Hà Nội khiến bạn nhớ nhất?"},
    {"prompt_vi": "Món ăn vặt nào ở phố cổ bạn muốn thử cùng mình?"}
  ]'::jsonb,
  '{"do": ["Chọn thời điểm chiều tối để thời tiết mát mẻ", "Đi giày thoải mái vì sẽ đi bộ nhiều", "Thử các món ăn vặt dọc đường"], "dont": ["Đi vào giờ cao điểm quá đông đúc", "Mang theo nhiều đồ đạc nặng nề", "Vội vã - hãy để thời gian trôi tự nhiên"]}'::jsonb,
  '["hanoi", "coffee", "walking", "outdoor", "budget_friendly", "evening"]'::jsonb,
  true
);

-- Activity 2: Cook Together at Home
INSERT INTO activities (
  slug,
  title_vi,
  description_vi,
  category,
  pillar,
  relationship_type,
  effort_level,
  time_required_minutes,
  location_type,
  city,
  cost_range,
  steps,
  conversation_prompts,
  tips,
  tags,
  is_active
) VALUES (
  'cook-dinner-together',
  'Cùng nhau nấu bữa tối',
  'Cùng nhau chuẩn bị và nấu một bữa ăn đơn giản tại nhà',
  'ritual',
  ARRAY['connection', 'appreciation'],
  ARRAY['new', 'long_term'],
  'medium',
  120,
  'home',
  ARRAY['hanoi', 'hcmc'],
  'budget',
  '[
    {"order": 1, "instruction_vi": "Cùng chọn món ăn đơn giản - có thể là mì xào, cơm chiên, hoặc pasta"},
    {"order": 2, "instruction_vi": "Đi chợ hoặc siêu thị mua nguyên liệu cùng nhau"},
    {"order": 3, "instruction_vi": "Về nhà, cùng nhau chuẩn bị nguyên liệu (rửa rau, thái thực phẩm)"},
    {"order": 4, "instruction_vi": "Phân công: một người nấu, một người hỗ trợ và dọn bếp"},
    {"order": 5, "instruction_vi": "Cùng thưởng thức bữa ăn, chia sẻ cảm nhận về món ăn"},
    {"order": 6, "instruction_vi": "Cùng nhau rửa bát và dọn dẹp"}
  ]'::jsonb,
  '[
    {"prompt_vi": "Món ăn nào mà mẹ/gia đình bạn nấu khiến bạn nhớ nhất?"},
    {"prompt_vi": "Nếu có thể học nấu một món từ bất kỳ nền ẩm thực nào, bạn chọn gì?"},
    {"prompt_vi": "Kỷ niệm gì liên quan đến bữa ăn mà bạn trân trọng?"}
  ]'::jsonb,
  '{"do": ["Chọn công thức đơn giản cho lần đầu", "Bật nhạc nhẹ nhàng khi nấu", "Cười với nhau khi có sai sót", "Chụp ảnh thành phẩm"], "dont": ["Quá cầu toàn về món ăn", "Để một người làm hết", "Vội vã - hãy tận hưởng quá trình"]}'::jsonb,
  '["home", "cooking", "quality_time", "budget_friendly", "evening"]'::jsonb,
  true
);

-- Activity 3: Deep Conversation with Questions
INSERT INTO activities (
  slug,
  title_vi,
  description_vi,
  category,
  pillar,
  relationship_type,
  effort_level,
  time_required_minutes,
  location_type,
  city,
  cost_range,
  steps,
  conversation_prompts,
  tips,
  tags,
  is_active
) VALUES (
  'deep-conversation-questions',
  'Trò chuyện sâu với 20 câu hỏi',
  'Dành thời gian tập trung trò chuyện với nhau thông qua các câu hỏi sâu',
  'conversation',
  ARRAY['understanding', 'communication'],
  ARRAY['new', 'long_term'],
  'low',
  45,
  'home',
  ARRAY['hanoi', 'hcmc'],
  'free',
  '[
    {"order": 1, "instruction_vi": "Tìm một nơi yên tĩnh, tắt tivi và điện thoại"},
    {"order": 2, "instruction_vi": "Ngồi đối diện hoặc cạnh nhau thoải mái"},
    {"order": 3, "instruction_vi": "Luân phiên trả lời các câu hỏi, mỗi người 3-5 phút"},
    {"order": 4, "instruction_vi": "Lắng nghe không ngắt lời, sau đó mới hỏi thêm nếu muốn hiểu rõ"},
    {"order": 5, "instruction_vi": "Không phán xét, chỉ chia sẻ và thấu hiểu"}
  ]'::jsonb,
  '[
    {"prompt_vi": "Khi nào bạn cảm thấy được yêu thương nhất?"},
    {"prompt_vi": "Nỗi sợ lớn nhất của bạn trong mối quan hệ là gì?"},
    {"prompt_vi": "Điều gì khiến bạn cảm thấy được trân trọng?"},
    {"prompt_vi": "Kỷ niệm tuổi thơ nào ảnh hưởng lớn đến con người bạn hiện tại?"},
    {"prompt_vi": "Bạn mong muốn điều gì nhất cho tương lai của chúng mình?"},
    {"prompt_vi": "Một điều bạn chưa bao giờ nói với mình là gì?"},
    {"prompt_vi": "Khi bạn căng thẳng, bạn cần gì từ mình nhất?"},
    {"prompt_vi": "Làm thế nào mình có thể thể hiện tình yêu tốt hơn với bạn?"}
  ]'::jsonb,
  '{"do": ["Dành trọn vẹn sự tập trung", "Chia sẻ thật lòng", "Cảm ơn nhau sau mỗi câu trả lời"], "dont": ["Vội vàng qua câu hỏi", "Xem điện thoại khi người kia nói", "Phán xét câu trả lời", "Chuyển câu chuyện về mình khi chưa lắng nghe xong"]}'::jsonb,
  '["home", "conversation", "quality_time", "free", "any_time", "deep_connection"]'::jsonb,
  true
);

-- Activity 4: Picnic at West Lake
INSERT INTO activities (
  slug,
  title_vi,
  description_vi,
  category,
  pillar,
  relationship_type,
  effort_level,
  time_required_minutes,
  location_type,
  city,
  cost_range,
  steps,
  conversation_prompts,
  tips,
  tags,
  is_active
) VALUES (
  'picnic-west-lake-hanoi',
  'Picnic bên Hồ Tây',
  'Chuẩn bị đồ ăn nhẹ và đến Hồ Tây ngắm hoàng hôn cùng nhau',
  'date',
  ARRAY['connection', 'novelty'],
  ARRAY['new', 'long_term'],
  'medium',
  120,
  'outdoor',
  ARRAY['hanoi'],
  'budget',
  '[
    {"order": 1, "instruction_vi": "Chuẩn bị: mua bánh mì, trái cây, nước uống, khăn trải"},
    {"order": 2, "instruction_vi": "Đến Hồ Tây lúc 16h-17h (trước hoàng hôn)"},
    {"order": 3, "instruction_vi": "Tìm chỗ ngồi yên tĩnh gần bờ hồ, trải khăn"},
    {"order": 4, "instruction_vi": "Cùng nhau ăn nhẹ và trò chuyện"},
    {"order": 5, "instruction_vi": "Ngắm hoàng hôn và chụp ảnh cùng nhau"},
    {"order": 6, "instruction_vi": "Dạo bộ quanh hồ sau khi ăn xong"}
  ]'::jsonb,
  '[
    {"prompt_vi": "Nếu được dành một ngày làm bất cứ điều gì, bạn sẽ làm gì?"},
    {"prompt_vi": "Kỷ niệm ngoài trời nào của bạn đáng nhớ nhất?"},
    {"prompt_vi": "Địa điểm nào bạn muốn chúng mình đi cùng nhau trong tương lai?"}
  ]'::jsonb,
  '{"do": ["Check thời tiết trước khi đi", "Mang theo túi rác để dọn dẹp", "Chọn giờ chiều để tránh nắng gắt"], "dont": ["Quên kem chống nắng", "Mang quá nhiều đồ đạc", "Đi vào ngày mưa"]}'::jsonb,
  '["hanoi", "outdoor", "nature", "sunset", "budget_friendly", "weekend"]'::jsonb,
  true
);

-- Activity 5: Write Love Notes
INSERT INTO activities (
  slug,
  title_vi,
  description_vi,
  category,
  pillar,
  relationship_type,
  effort_level,
  time_required_minutes,
  location_type,
  city,
  cost_range,
  steps,
  conversation_prompts,
  tips,
  tags,
  is_active
) VALUES (
  'write-appreciation-notes',
  'Viết thư cảm ơn nhau',
  'Dành thời gian viết những điều trân trọng về nhau',
  'ritual',
  ARRAY['appreciation', 'communication'],
  ARRAY['new', 'long_term'],
  'low',
  30,
  'home',
  ARRAY['hanoi', 'hcmc'],
  'free',
  '[
    {"order": 1, "instruction_vi": "Chuẩn bị: 2 tờ giấy đẹp và 2 cây bút"},
    {"order": 2, "instruction_vi": "Ngồi riêng 10-15 phút, mỗi người viết cho nhau"},
    {"order": 3, "instruction_vi": "Viết 3 điều bạn trân trọng nhất về người ấy"},
    {"order": 4, "instruction_vi": "Viết cụ thể: không phải ''tốt bụng'' mà là ''tuần trước bạn đã...''"},
    {"order": 5, "instruction_vi": "Trao thư cho nhau và đọc thầm trước"},
    {"order": 6, "instruction_vi": "Đọc to cho nhau nghe, cảm ơn sau mỗi lá thư"},
    {"order": 7, "instruction_vi": "Giữ lại những lá thư này"}
  ]'::jsonb,
  '[
    {"prompt_vi": "Khoảnh khắc nào khiến bạn cảm thấy tự hào về mình nhất?"},
    {"prompt_vi": "Hành động nhỏ nào của mình mà bạn thực sự trân trọng?"},
    {"prompt_vi": "Điều gì về mình đã thay đổi bạn theo hướng tích cực?"}
  ]'::jsonb,
  '{"do": ["Viết chi tiết và cụ thể", "Viết từ trái tim, không cần hoàn hảo", "Giữ lại những lá thư để đọc lại sau này"], "dont": ["Viết chung chung ''bạn tốt''", "So sánh với người khác", "Vội vã - hãy suy ngẫm kỹ"]}'::jsonb,
  '["home", "appreciation", "quality_time", "free", "any_time", "emotional_connection"]'::jsonb,
  true
);

-- Activity 6: Morning Coffee Ritual
INSERT INTO activities (
  slug,
  title_vi,
  description_vi,
  category,
  pillar,
  relationship_type,
  effort_level,
  time_required_minutes,
  location_type,
  city,
  cost_range,
  steps,
  conversation_prompts,
  tips,
  tags,
  is_active
) VALUES (
  'morning-coffee-ritual',
  'Nghi thức cà phê sáng',
  'Bắt đầu ngày mới với một tách cà phê và 15 phút trò chuyện',
  'ritual',
  ARRAY['connection', 'communication'],
  ARRAY['long_term'],
  'low',
  20,
  'home',
  ARRAY['hanoi', 'hcmc'],
  'free',
  '[
    {"order": 1, "instruction_vi": "Thức dậy sớm hơn 20 phút so với bình thường"},
    {"order": 2, "instruction_vi": "Cùng nhau pha cà phê (hoặc trà nếu thích)"},
    {"order": 3, "instruction_vi": "Ngồi xuống cùng nhau, không mở điện thoại"},
    {"order": 4, "instruction_vi": "Chia sẻ: ''Hôm nay mình mong chờ điều gì?''"},
    {"order": 5, "instruction_vi": "Hỏi: ''Có điều gì mình có thể hỗ trợ bạn hôm nay không?''"},
    {"order": 6, "instruction_vi": "Kết thúc bằng một cái ôm hoặc nắm tay"}
  ]'::jsonb,
  '[
    {"prompt_vi": "Điều gì khiến bạn hào hứng nhất hôm nay?"},
    {"prompt_vi": "Có điều gì đang làm bạn lo lắng không?"},
    {"prompt_vi": "Làm sao mình có thể khiến ngày của bạn tốt hơn?"}
  ]'::jsonb,
  '{"do": ["Làm thành thói quen hàng ngày", "Tập trung hoàn toàn vào nhau", "Giữ không khí nhẹ nhàng, tích cực"], "dont": ["Bàn về công việc căng thẳng", "Vội vã", "Xem điện thoại"]}'::jsonb,
  '["home", "morning", "ritual", "quality_time", "free", "daily", "communication"]'::jsonb,
  true
);
